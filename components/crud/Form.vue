<template>
  <div class="form">
    <div v-if="res.message" class="text-red">{{ res.message }}</div>
    <FormKit v-if="schema" type="form" method="post" submit-label="Submit" form-class="w-full"
            :actions="can(model, 'submit')"
            v-model="row" 
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
  import { useAppContext } from '~/store/global'; 
  import { normalizeInput, can } from '~/libs/core/helpers'; 

  let { $axios } = useNuxtApp() 
  let Instance = Resource({ $axios })
  const emit = defineEmits(['saved'])
  const App = useAppContext()
  const schema = ref([])

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
 
  const save = (data) => {
    Instance.setModel(JSON.parse(JSON.stringify(model)))

    console.log('Save', data)
    let exclude = Object.keys(data).filter(i => i.includes('__'))
    Instance.saveData(_.omit(data, exclude)).then((rs) => {
      alert("Saved ")
      res.value = rs
      emit('saved', rs)
    }).catch(err => res.value = _.get(err, 'response.data', err) )
  }

  let row = ref(data)
  let res = ref({})

  watch(model, (newVal) => {
    console.log('form wathc', newVal)
    Instance.setModel(JSON.parse(JSON.stringify(newVal))) 
  })

  const modifyInput = async (input) => {
    if( input.model && typeof input.model == 'string' ) 
      input.model = await App.loadModel(input.model)

    return input
  }

  onBeforeMount(async () => {
    try {  
      Instance.setModel(JSON.parse(JSON.stringify(model)))
      // row.value = await Instance.getData(row.value)
 
      // Instance.setModel(model.value)
      // resource.value = await Instance.getData() 

      for(let row of model.properties){ 
        schema.value.push( await normalizeInput(row, modifyInput) )
      } 
    } catch (error) {
      console.error("onmounted", error)
    }
  })
  onUnmounted(() => { 
    console.log("onmounted")
  })
</script>

<style>
.formkit-wrapper{
	max-width: 100% !important;
}
</style>