import { createInput } from '@formkit/vue'
import _ from 'lodash'
import ResourceClass from '~/libs/core/resource'
import { mergeDeep, interpolate } from '~~/libs/core/helpers' 
 
const features = (node) => {
  let loading = false; 
  const { $axios } = useNuxtApp()
  const schemaModel = inject('model')
  const Instance = ResourceClass({ $axios }) 
  node.props.arrOptions = []

  const getOptions = async ({ rootApi, fieldLabel, fieldValue, ...data }) => {
    try{  
      console.log('getOptions', { rootApi, fieldLabel, fieldValue, ...data })
      if( rootApi ){
        loading = true;
        rootApi = interpolate(rootApi, { data: node.value })
        Instance.setModel({ api:{ ...data,  rootApi, resource:{} } })

        let { rows } = await Instance.getData({ data: node.value}) 

        node.props.arrOptions = rows && rows.map((i, k) => ({ 
            label: _.get(i, fieldLabel, i.toString()), 
            value: _.get(i, fieldValue, k)
          }) 
        ) 

        loading = false; 
      }
    }catch(e){
        alert('Erro to get data from '+ rootApi)
        console.log('Erro select input', e)
    }
  }

  const init = async () => { 
    let { model = {}, overwrite = {} } = node.props.attrs
    model = mergeDeep(model, overwrite)
    if( model && typeof model  == 'string' ) return console.error('model string not loaded')
    
    getOptions(model.api)
  }
  
  init() 
  // We wait for our node to be fully  "created" before we start to add our
  // handlers to ensure the core Vue plugin has added its context object:
  node.on('created', () => {  
    node.props.arrOptions = node.props.options

    Object.assign(node.context.handlers, { 
      setValue: e => {
        node.input(e) 
      }, 
      refresh: () => { 
        let { model = {}, overwrite = {} } = node.props
        model = mergeDeep(model, overwrite)
        if( model && typeof model  == 'string' ) return console.error('model string not loaded')
        
        getOptions(model.api)
      },  
    })
 
  })
}
 
const schema = [  
  {   
    $el: 'select',
    attrs: { 
      name: '$context.name',
      id: '$context.id',
      oninput: '$handlers.DOMInput', 
      value: '$_value',
      class: 'formkit-input',
    },
    children:[
      {
        $el: 'option',
        for: ['item', '$arrOptions'],
        attrs:{
          value: '$item.value'
        },
        children: '$item.label'
      }
    ]
  }, 
  {
    $el: 'button', 
    attrs:{
      type: 'button',
      onClick: '$handlers.refresh'
    },
    children: [
      {
        $el:'svg',
        attrs:{
          xmlns:"http://www.w3.org/2000/svg",
          viewBox:"0 0 512 512",
          class: 'w-4 m-2'
        },
        children:[
          {
            $el: 'path',
            attrs:{
              d:"M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"
            }
          }
        ]
      }
    ] 
  }
] 

export const dynamic = createInput(schema, {
  props: ['overwrite', 'model', 'options', 'arrOptions'],
  features: [features],
})

{/* 
    EXAMPLE

    <FormKit
        type="dynamic" 
        name="campo1"
        v-model="data" 
        :options="[]"
        :model="{}"
        :overwrite="{ 
          api:{
            fieldValue: 'id',
            fieldLabel: 'city'
          } 
        }"
    />
*/}