<template>
  <NuxtLayout name="logged" >
    <section class="content m-1 md:mx-12" v-if="model"> 
      <CrudAuth @auth:logged="doLogged">
        <CommonsModal v-model:show="form.__isOpen" >
          <template #title>Create/Edit {{ form.id }}</template>
          <CrudForm :model="model" :data="form" @saved="postActions" />
        </CommonsModal>

        <CrudTable :resource="resource" @create="actions" @edit="actions" @delete="actions"  />  
      </CrudAuth>
    </section>
  </NuxtLayout>
</template>

<script setup>
  import _ from 'lodash'   
  import { useAppContext } from '~/store/global';
  import Resource from '~/libs/core/resource'
  const { $axios, $message } = useNuxtApp()
  const { current={} } = useAppContext() 
  const env = useRuntimeConfig()
 
  let Instance = Resource({ $axios })
  let route = useRoute() 

  let { data:model } = await useAsyncData('model_'+route.params.file, ({ $axios }) => {  
    return $axios.get(`${env.public.VUE_APP_BASE_API}${current.resources_path}${ _.get(current, `resources[${route.params.file}].resource`, '404') }`).then( ({data}) => data )
  })

  provide('model', model)  
   
  let form = ref({}) 
  let resource = ref([]) 

  let actions = ({ target, row }) => { 
    row = JSON.parse(JSON.stringify(row))
    // Instance.setModel(JSON.parse(JSON.stringify(model.value)))

    if( target == 'delete' )
      console.log("fiel deleted ")
    else
      form.value = { ...row, __isOpen:true } 
  }

  let postActions = (type) => {
    if( type == 'saved')
      form.value = {}
  }

  const doLogged = ({ request }) => {
    _.set(model.value, 'api', {...model.value.api, ...request, 'novavar': true })
    
    // Inst.setModel(model.value)
  }
  
  // watch(route.params.file, async () => {
  //   console.error("watch file", route.params)
  //   model.value = await $axios.get(`${current.resources_path}${ _.get(current, `resources[${route.params.file}].resource`, '404') }`).then( ({data}) => data )

  //   getDatasource()
  // })
  
  onMounted(async() => {
    try { 
      model.value = await $axios.get(`${current.resources_path}${ _.get(current, `resources[${route.params.file}].resource`, '404') }`).then( ({data}) => data )

      console.table("controller mounted", model.value)

      Instance.setModel(JSON.parse(JSON.stringify(model.value))) 
    } catch (error) {
      console.error("onmounted", error)
    }
  })

  onUnmounted(async () => {
    try { 
      console.error("controller unmounted", model.value)
    } catch (error) {
      console.error("onunmounted", error)
    }
  })
</script>