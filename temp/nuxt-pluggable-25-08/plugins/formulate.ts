import { plugin, defaultConfig, } from '@formkit/vue'

export default defineNuxtPlugin( (nuxtApp) => {
  const helloWorld = 

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