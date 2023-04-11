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
  import Resource from '~/libs/core/resource'
  import { useAppContext } from '~/store/global'; 
  import { useAuth } from '~/store/auth'; 
  import { normalizeInput, can, mergeDeep, filterParams } from '~/libs/core/helpers'; 

  let { $axios, $bus, $message } = useNuxtApp() 
  let Instance = Resource({ $axios })
  const emit = defineEmits(['saved'])
  const App = useAppContext()
  const Auth = useAuth()
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
 
  const save = (payload) => {
    Instance.setModel(JSON.parse(JSON.stringify(model)))

    console.log('Save', payload)
    let exclude = Object.keys(payload).filter(i => i.includes('__'))
    Instance.saveData(_.omit(payload, exclude)).then((rs) => {
      $message("Saved ")
      res.value = rs
      emit('saved', rs)

      $bus.emit('form:created', payload)
    }).catch(err => res.value = _.get(err, 'response.data', err) )
  }

  let row = ref(data)
  let res = ref({})
 
  const getDatasource = async (payload={}, config={}) => {
    try { 
      console.debug("chamou to formDatasource", model)  
      let api = filterParams({ ..._.get(model, 'api', {}) }, { data: row.value }) 

      Instance.setModel({ ...model, api })

      row.value = await Instance.getDataObject(payload, config)
        
      console.debug("concluiu  getDatasource", api)
    } catch (error) {
      console.error('error formDatarousce', error)
      alert("Error to getData")
    }
  }

  watch(model, (newVal) => {
    console.log('form wathc', newVal)
    Instance.setModel(JSON.parse(JSON.stringify(newVal))) 
  })

  const modifyInput = async (input) => {
    if( input.model && typeof input.model == 'string' ) 
      input.model = await App.loadModel(input.model)
    
    if( Auth?.session?.request )
    	input.model = mergeDeep((input.model || {}), { api:Auth?.session?.request })

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

  onMounted(() => {
    if( model.type == 'form' )
        getDatasource()
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