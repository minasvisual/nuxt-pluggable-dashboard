// formkit.config.ts
import { en } from '@formkit/i18n'
import { DefaultConfigOptions } from '@formkit/vue' 
import IMask from 'imask';

import LinkComponent from '~/components/crud/tables/link.vue'
import CodeInput from '~/components/crud/inputs/code.vue'
import JsonInput from '~/components/crud/inputs/json.vue'
import EditorInput from '~/components/crud/inputs/editor.vue'
import ToggleInput from '~/components/crud/inputs/toggle.vue'
import TagsInput from '~/components/crud/inputs/tags.vue'
import GridInput from '~/components/crud/inputs/grid.vue'
import CurrencyInput from '~/components/crud/inputs/currency.vue'
import { autocomplete } from './components/crud/inputs/autocomplete'
import { image } from './components/crud/inputs/image'
import { dynamic } from './components/crud/inputs/dynamic'
import { multiple } from './components/crud/inputs/multiple'

const inputByComponent = (comp, type = 'input', props = []) : any => { 
  return {
    // Node type: input, group, or list.
    type: type,
    // Schema to render (schema object or function that returns an object)
    schema: [],
    // A Vue component to render (use schema _OR_ component, but not both)
    component: comp,
    // (optional) Input specific props the <FormKit> component should accept.
    // should be an array of camelCase strings
    props: props,
    // (optional) Array of functions that receive the node.
    features: []
  }
}

const imaskPlugin = (node) => {
  //https://imask.js.org/guide.html#masked
  let { mask } = node.props?.attrs || {} 
  if ( node.props.family === 'text' && mask ) {  
    node.hook.commit((value) => {  
      console.log(mask)
      if ( mask && value ) { 
        const maskOptions = typeof mask === 'object' && mask.mask ? mask : { 'mask': mask }  
        return IMask.createMask(maskOptions).resolve(value)
      } else {
        return value
      }
    })
  }
}

const config: DefaultConfigOptions = {
  locales: { en },
  locale: 'en',
  plugins:[
    imaskPlugin  
  ],
  props:['model','overwrite','mask'],
  inputs:{
    'link': inputByComponent(LinkComponent),
    'autocomplete': autocomplete,
    'code': inputByComponent(CodeInput, 'input'),
    'json': inputByComponent(JsonInput, 'input'),
    'editor': inputByComponent(EditorInput, 'input'),
    'toggle': inputByComponent(ToggleInput, 'input', ['boolean']),
    'tags': inputByComponent(TagsInput, 'input', ['output']),
    'grid': inputByComponent(GridInput, 'input',),
    'currency': inputByComponent(CurrencyInput, 'input',),
    'image': image,
    'dynamic': dynamic,
    'multiple': multiple,
  }
}
  
export default config