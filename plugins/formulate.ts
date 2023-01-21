import { plugin, defaultConfig, } from '@formkit/vue' 
import Tabs from '@/components/crud/common/Tabs.vue'
import Section from '@/components/crud/layouts/Section.vue'
import Forms from '@/components/crud/layouts/Forms.vue'
import Editor from '@/components/crud/layouts/Editor.vue'

export default defineNuxtPlugin( (nuxtApp) => {
  const helloWorld = ''
  nuxtApp.vueApp.component('Tabs', Tabs)
  nuxtApp.vueApp.component('UiSection', Section)
  nuxtApp.vueApp.component('UiForms', Forms)
  nuxtApp.vueApp.component('UiEditor', Editor)
  
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