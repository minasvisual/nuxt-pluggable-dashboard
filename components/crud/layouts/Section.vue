<template> 
  <FormKitSchema :class="{'display': ready ? 'block':'none'}" :schema="schema?.properties || schema" :data="section" />
</template>
 
<script setup>  
  import { $attrs } from '@formkit/inputs';
import ResourceClass from '~/libs/core/resource'
  import { useAppContext } from '~/store/global';  

  const { $axios } = useNuxtApp()  
  const { current={}, loadModel } = useAppContext()  
  const { model } = defineProps(['model'])
  const ready = ref(false)
  // const section = ref({})
  let Instance = ResourceClass({ $axios })

  const { data:schema } = await useAsyncData('section_'+model, ({ }) => {  
    return loadModel(model, 'sections').then( 
      data => { 
        return data 
      }
    ).catch(console.error)
  }) 

  const { data:section } = await useAsyncData('data_'+model, async ({ }) => {  
    if( schema.value?.api ){
      Instance.setModel(schema.value)
      return await Instance.getData({}, {})
    }else{
      return {}
    }
  }) 
 
  onMounted(async () => { 
    ready.value = true
  })
</script>
