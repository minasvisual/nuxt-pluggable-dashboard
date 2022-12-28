<template> 
  <FormKitSchema :schema="model.properties" />
</template>

<script setup> 
import _ from 'lodash'   
import { useAppContext } from '~/store/global'; 
const { $axios, $message } = useNuxtApp()
const { current={} } = useAppContext() 
const route = useRoute() 
const env = useRuntimeConfig()

let { data:model } = await useAsyncData('model_'+route.path, ({ $axios }) => {  
  return $axios.get(`${env.public.VUE_APP_BASE_API}${current.resources_path}${ _.get(current, `pages['${route.path}'].resource`, '404') }`)
  .then( ({data}) => {
    return data 
  }).catch(console.error)
})
</script>