// formkit.config.ts
import { en } from '@formkit/i18n'
import { DefaultConfigOptions } from '@formkit/vue' 
import LinkComponent from '~/components/crud/tables/link.vue'

const helloWorld = {
  // Node type: input, group, or list.
  type: 'input',
  // Schema to render (schema object or function that returns an object)
  schema: [],
  // A Vue component to render (use schema _OR_ component, but not both)
  component: LinkComponent,
  // (optional) Input specific props the <FormKit> component should accept.
  // should be an array of camelCase strings
  props: ['cell','data','row'],
  // (optional) Array of functions that receive the node.
  features: []
}

const config: DefaultConfigOptions = {
  locales: { en },
  locale: 'en',
  inputs:{
    'link': helloWorld as any
  }
}
  
export default config