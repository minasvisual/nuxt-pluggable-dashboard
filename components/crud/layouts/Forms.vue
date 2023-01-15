<template> 
  <CrudForm :class="({'display': ready ? 'block':'none'})" :model="schema" :data="section" @saved="e =>postActions('saved', e)" /> 
</template>
 
<script setup>   
  import ResourceClass from '~/libs/core/resource'
  import { useAppContext } from '~/store/global';  

  const { $axios } = useNuxtApp()  
  const { current={}, loadModel } = useAppContext()  
  const { model } = defineProps(['model'])
  const ready = ref(false)
  const section = ref({})
  let Instance = ResourceClass({ $axios })

  const { data:schema } = await useAsyncData('forms_'+model, ({ }) => {  
    return loadModel(model, 'sections').then( 
      data => { 
        if( typeof data == 'string' && data.includes('{') ) data = JSON.parse(data) 
        return data 
      }
    ).catch(console.error)
  }) 

  // const { data:section } = await useAsyncData('data_'+model, async ({ }) => {  
  //   if( schema.value?.api ){
  //     Instance.setModel(schema.value)
  //     return await Instance.getData({}, {})
  //   }else{
  //     return {}
  //   }
  // }) 

  function postActions (type, data){
    console.debug('saved', data)
  }
 
  onMounted(async () => { 
    ready.value = true
  })
</script>
