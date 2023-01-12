<template> 
<CommonsFragment>
  <FormKitSchema v-if="model" :schema="model?.properties || model" />
</CommonsFragment>
</template>

<script setup> 
import _ from 'lodash'   
import { useAppContext } from '~/store/global'; 
const { $axios, $message } = useNuxtApp()
const { current={}, projects = [] } = useAppContext() 
const route = useRoute() 
const env = useRuntimeConfig() 

let { data:model } = await useAsyncData('model_'+route.path, async ({ $axios }) => {  
  let defaultProj = env.public.VUE_APP_FRONT_PROJECT ? _.find(projects, ['code', env.public.VUE_APP_FRONT_PROJECT]) : current 
    
  return await $axios.get(`${env.public.VUE_APP_BASE_API}${defaultProj.resources_path}${ _.get(defaultProj, `pages['${route.path}'].resource`) }`)
  .then( ({data}) => {
    return data 
  }).catch(console.error)
})
 
useHead(current.head ?? {}) 
</script>
