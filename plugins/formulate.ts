import { plugin, defaultConfig, } from '@formkit/vue' 
import Tabs from '@/components/crud/common/Tabs.vue'

export default defineNuxtPlugin( (nuxtApp) => {
  const helloWorld = ''
  nuxtApp.vueApp.component('Tabs', Tabs)
  
  nuxtApp.vueApp.use( 
    plugin, 
    defaultConfig({
      inputs: {
        // The property will be the “type” in <FormKit type="hello">
        'hello': {
          type: 'input',
          schema: ['Hello world'],
        },
      },
    })
  )
})