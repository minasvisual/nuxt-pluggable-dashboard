// formkit.config.ts
import { en } from '@formkit/i18n'
import { DefaultConfigOptions } from '@formkit/vue' 
import LinkComponent from '~/components/crud/tables/link.vue'
import CodeInput from '~/components/crud/inputs/code.vue'
import JsonInput from '~/components/crud/inputs/json.vue'
import EditorInput from '~/components/crud/inputs/editor.vue'
import { autocomplete } from './components/crud/inputs/autocomplete'
import { image } from './components/crud/inputs/image'
import { dynamic } from './components/crud/inputs/dynamic'

const inputByComponent = (comp, type = 'input', props = ['cell','data','row']) : any => ({
  // Node type: input, group, or list.
  type: 'input',
  // Schema to render (schema object or function that returns an object)
  schema: [],
  // A Vue component to render (use schema _OR_ component, but not both)
  component: comp,
  // (optional) Input specific props the <FormKit> component should accept.
  // should be an array of camelCase strings
  props: props,
  // (optional) Array of functions that receive the node.
  features: []
})

const config: DefaultConfigOptions = {
  locales: { en },
  locale: 'en',
  inputs:{
    'link': inputByComponent(LinkComponent),
    'autocomplete': autocomplete,
    'code': inputByComponent(CodeInput, 'input'),
    'json': inputByComponent(JsonInput, 'input'),
    'editor': inputByComponent(EditorInput, 'input'),
    'image': image,
    'dynamic': dynamic
  }
}
  
export default config