import { createInput } from '@formkit/vue'
import _ from 'lodash'
import ResourceClass from '~/libs/core/resource'
import { mergeDeep, interpolate } from '~~/libs/core/helpers' 

let arrOptions = []
const searchFeature = async (node) => {
  const { $axios } = useNuxtApp()
  const schemaModel = inject('model')
  const Instance = ResourceClass({ $axios })   

  const getOptions = async ({ rootApi, fieldLabel, fieldValue, ...data }) => {
    try{   
      if( rootApi ){ 
        rootApi = interpolate(rootApi, { data: node.value })
        Instance.setModel({ api:{ ...data,  rootApi, resource:{} } })

        let { rows } = await Instance.getData({ data: node.value}) 

        arrOptions = rows && rows.map((i, k) => ({ 
            label: _.get(i, fieldLabel, i.toString()), 
            value: _.get(i, fieldValue, k)
          }) 
        )  
      }
    }catch(e){
        alert('Erro to get data from '+ rootApi)
        console.log('Erro select input', e)
    }
  }

  const init = async () => { 
    console.log('pre init', node.props)
    if( !node.props?.model ) return 'DISMISSED';

    let { model = {}, overwrite = {} } = node.props
    model = mergeDeep(model, overwrite)
    if( model && typeof model  == 'string' ) 
      return console.error('model string not loaded')
    
    await getOptions(model.api)
  }
 
  node.on('created', async () => {
    await init()
    // Ensure our matches prop starts as an array.
    node.props.matches = []
    node.props.selection = ''
    node.props.active = '' 
    node.props.allOptions = [...arrOptions, ...node.props.options].map((i, k) => {
      if( typeof i == 'string' )
         i = { value:k, label:i }
      return i
    })  

    if( node.value ){
      let preSelected = node.props.allOptions.find(i => i.value == node.value)
      node.props.active = preSelected?.label ?? '??'
    }
    // When we actually have an value to set:
    const setValue = async (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault()
      let selected = node.props.selection
      let modelFound = node.props.allOptions.find(
        i => {
          return i.label === selected
        }
      )
      
      node.input( modelFound?.value )
      node.props.active = modelFound?.label ?? selected
      node.props.selection = ''
      node.props.searchValue = ''

      await new Promise((r) => setTimeout(r, 50)) // "next tick"

      if ( document.querySelector('input#' + node.props.id) ) {
        document.querySelector('input#' + node.props.id).focus()
      }
    }

    // Perform a soft selection, this is shown as a highlight in the dropdown
    const select = (delta) => { 
      const available = node.props.matches
      let idx = available.indexOf(node.props.selection) + delta
      if (idx >= available.length) {
        idx = 0
      } else if (idx < 0) {
        idx = available.length - 1
      }
      node.props.selection = available[idx]
    }

    // Add some new "handlers" for our autocomplete. The handlers object is
    // just a conventionally good place to put event handlers. Auto complete
    // inputs always have to deal with lots of keyboard events, so that logic
    // is registered here.
    Object.assign(node.context.handlers, {
      setValue,
      selection: (e) => {
        // This handler is called when entering data into the search input.
        switch (e.key) {
          case 'Enter':
            return setValue()
          case 'ArrowDown':
            e.preventDefault()
            return select(1)
          case 'ArrowUp':
            e.preventDefault()
            return select(-1)
        }
      },
      search(e) {
        node.props.searchValue = e.target.value
      },
      hover: (e) => {
        node.props.selection = e.target.textContent
      },
      unhover: (e) => {
        if (e.target.textContent === node.props.selection) {
          node.props.selection = ''
        }
      },
    })
 
  })

  // Perform filtering when the search value changes
  node.on('prop:searchValue', ({ payload: value }) => {
    const results = node.props.allOptions.filter((option) => { 
      return option.label.toLowerCase().startsWith(value.toLowerCase())
    })
    if (!results.length) results.push({ label:'No matches' })
    node.props.matches = results
  })
}

const schema = [ 
  {
    if: "$value && $active",
    then: [
      {
        $el: 'a',
        attrs: {
          id: '$id',
          href: '#',
          class: '$classes.value',
          onClick: '$handlers.setValue',
        },
        children: '$active',
      },
    ],
    else: [
      {
        $el: 'input',
        bind: '$attrs',
        attrs: {
          id: '$id',
          class: '$classes.input',
          onKeydown: '$handlers.selection',
          onInput: '$handlers.search',
          value: '$searchValue',
        },
      },
      {
        $el: 'ul',
        if: '$matches.length < $allOptions.length',
        attrs: {
          class: '$classes.dropdown',
        },
        children: [
          {
            $el: 'li',
            for: ['match', '$matches'],
            attrs: {
              'data-selected': {
                if: '$selection === $match.value',
                then: 'true',
                else: 'false',
              },
              class: '$classes.dropdownItem',
              onClick: '$handlers.setValue',
              onMouseenter: '$handlers.hover',
              onMouseleave: '$handlers.unhover',
            },
            children: '$match.label',
          },
        ],
      },
    ],
  }, 
]

export const autocomplete = createInput(schema, {
  props: ['options', 'allOptions', 'matches', 'selection', 'searchValue', 'active', 'overwrite', 'model'],
  features: [searchFeature],
})

 
{/* 
    EXAMPLE

    <FormKit
        type="autocomplete" 
        name="campo1"
        v-model="data" 
        :options="[]"
        :model="{}"
        :overwrite="{}"
    />
*/}