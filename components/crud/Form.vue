<template>
  <div class="form">
    <div v-if="res.message" class="text-red">{{ res.message }}</div>
    <FormKit v-if="schema" type="form" method="post" submit-label="Submit"
             v-model="data" 
             @submit="save" 
    >
      <FormKitSchema :schema="schema" />
    </FormKit> 
    <div v-else>
      schema nao encontrado
    </div>
  </div>
</template>



<script setup>
  import _ from 'lodash'
  import { FormKit, FormKitSchema } from '@formkit/vue'
  import Resource from '~/libs/core/resource'

  let { $axios } = useNuxtApp() 
  let Instance = Resource({ $axios })
  const emit = defineEmits(['saved'])

  const { model, data } = defineProps({
    model: {
      type: Object,
      default: () => ({ properties: [] })
    }, 
    data: {
      type: Object,
      default: () => ({})
    }, 
  })

  let schema = computed(() => {
    return model.properties.map((row) => {
      return {
        ...row,
        $formkit: _.get(row, 'type', 'text'), 
      }
    })
  })

  const save = (data) => {
    console.log('Save', data)
    Instance.saveData(data).then((rs) => {
      alert("Saved ")
      res.value = rs
      emit('saved', rs)
    }).catch(err => res.value = get(err, 'response.data', err) )
  }

  let row = ref(data)
  let res = ref({})

  onMounted(async () => {
    try { 
      console.log("onmounted")
      Instance.setModel(JSON.parse(JSON.stringify(model)))
      row.value = await Instance.getData(row.value)
 
      // Instance.setModel(model.value)
      // resource.value = await Instance.getData()
    } catch (error) {
      console.error("onmounted", error)
    }
  })
  onUnmounted(() => { 
    console.log("onmounted")
  })
</script>
