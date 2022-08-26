<template>
  <NuxtLayout class="content" name="logged" >
    <section class="content mx-1 md:mx-12" v-if="model"> 
      
        <CommonsModal v-model:show="form.__isOpen" >
          <template #title>Create/Edit {{ form.id }}</template>
          <CrudForm :model="model" :data="form" @saved="postActions" />
        </CommonsModal>

        <CrudTable :resource="resource" @new="actions" @edit="actions" @delete="actions" /> 

    </section>
  </NuxtLayout>
</template>

<script setup>
  import _ from 'lodash'   
  import { useAppContext } from '~/store/global';
  const { $axios } = useNuxtApp()
  const { current={} } = useAppContext()
   
  let route = useRoute() 

  let { data:model } = await useAsyncData('model_'+route.params.file, ({ $axios }) => {   
    return $axios.get(`${current.resources_path}${ _.get(current, `resources[${route.params.file}].resource`, '404') }`).then( ({data}) => data )
  })

  provide('model', model)  

  let form = ref({}) 
  let resource = ref([]) 

  let actions = ({ target, row }) => { 
    if( target == 'delete')
      console.log("delete", row)
    else
      form.value = { ...JSON.parse(JSON.stringify(row)), __isOpen:true } 
  }

  let postActions = (type) => {
    if( type == 'saved')
      form.value = {}
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