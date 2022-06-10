<template>
  <NuxtLayout class="content" >
    <section class="content mx-12" v-if="model">
      <CrudAuth :project="current" :schema="model">
        <CommonsModal v-model:show="form.__isOpen" >
          <template #title>Create/Edit {{ form.id }}</template>
          <CrudForm :model="model" :data="form" @saved="postActions" />
        </CommonsModal>
        <CrudTable :resource="resource" @new="actions" @edit="actions" @delete="actions" />
      </CrudAuth>
    </section>
  </NuxtLayout>
</template>

<script setup>
  import _ from 'lodash'   
  import { useAppContext } from '~/store/global';
  const { current={} } = useAppContext()
   
  let route = useRoute() 

  const { data:model } = await useAsyncData('data_'+route.params.file, ({ $axios }) => {  
    console.log(`${current.resources_path}${ _.get(current, `resources[${route.params.file}].resource`, '404') }`)
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
  
  onMounted(async() => {
    try { 
    } catch (error) {
      console.error("onmounted", error)
    }
  })
</script>