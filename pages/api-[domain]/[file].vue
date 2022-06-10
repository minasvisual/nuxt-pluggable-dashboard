<template>
  <section class="content mx-12" v-if="model">
    <CommonsModal v-model:show="form.__isOpen" >
      <template #title>Create/Edit {{ form.id }}</template>
      <CrudForm :model="model" :data="form" @saved="postActions" />
    </CommonsModal>
    <CrudTable :resource="resource" @new="actions" @edit="actions" @delete="actions" />
  </section>
</template>

<script setup>
  import _ from 'lodash'   
   
  let route = useRoute() 

  const { data:model } = await useAsyncData('model_'+route.params.file, ({ $axios }) => {  
    return $axios.get(`/models/${route.params.file}.json`).then( ({data}) => data )
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