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
  node.props.arrFiltered = []

  if(!Array.isArray(node.value))
    node.input([])

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

        node.props.arrFiltered = node.props.arrOptions
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
      checked: e => {
        let item = e.target.value
        let exists = node.value.findIndex(i => i == item)
        if( exists >= 0 ){
          node.input( node.value.splice(exists, 1) ) 
        }else{
          node.input( node.value.push(item) )
        } 
      },
      isChecked: e => {  
        return node.value.some(i => e == i)
      },
      filter: e => {
        let busca = e.target?.value
        if( busca )
          node.props.arrFiltered = node.props.arrOptions.filter(
            i => i.label?.toLowerCase().startsWith(busca?.toLowerCase())
          )
        else
          node.props.arrFiltered = node.props.arrOptions
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
    $el: 'div',
    attrs: {
      class: 'w-full'
    },
    children:[
      {   
        $el: 'input',
        attrs: { 
          type: 'search',
          name: '$context.name',
          id: '$context.id',
          oninput: '$handlers.filter',  
          class: 'formkit-input w-full',
          placeholder: 'filter'
        }, 
      },
      {
        $el: 'div', 
        attrs: {
          class: 'grid grid-cols-3 py-2 gap-2 w-full max-h-28 overflow-y-auto overflow-x-hidden'
        },
        children:[
          {
            $el: 'label',
            for: ['item', '$arrFiltered'],
            attrs:{
              for: '#$item.value', 
              value: '$item.value',
              class: 'flex items-center gap-2 p-2',
            },
            children: [ 
              {
                $el: 'input', 
                attrs: {
                  type: 'checkbox',
                  class: 'flex flex-col',
                  value: '$item.value',
                  onclick: '$handlers.checked',
                  checked: '$handlers.isChecked($item.value)'
                },
              },
              {
                $el: 'p',  
                attrs: {
                  class: 'whitespace-nowrap', 
                },
                children: '$item.label'
              }
            ]
          }
        ]
      } 
    ]
  }
] 

export const multiple = createInput(schema, {
  props: ['overwrite', 'model', 'options', 'arrOptions', 'arrFiltered'],
  features: [features],
})

{/* 
    EXAMPLE

    <FormKit
        type="multiple" 
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