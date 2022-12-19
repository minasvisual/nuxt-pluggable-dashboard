import { createInput } from '@formkit/vue'
import _ from 'lodash'
import ResourceClass from '~/libs/core/resource'
import { mergeDeep } from '~~/libs/core/helpers' 
 
const features = (node) => {
  const { $axios } = useNuxtApp()
  const schemaModel = inject('model')
  const Instance = ResourceClass({ $axios })
   
  // We wait for our node to be fully  "created" before we start to add our
  // handlers to ensure the core Vue plugin has added its context object:
  node.on('created', () => {  
    // Ensure our matches prop starts as an array.
    const upload = async (e) => { 
      console.log('upload change')
      let file = e.target.files[0]
      let { model, api } = node.props
      
      const formData = new FormData()
      formData.append('file', file)

      // model = URL.createObjectURL(file);
      model.api = mergeDeep(model.api, api)
      Instance.setModel(model)
 
      return await Instance.saveData( 
          formData
        )
        .then((data) => {
          if( data )
            node.input( _.get(data, (node.props.wrap || '[0].src'), data) ) 
          else {
             alert('Erro ao fazer upload')
             console.error(data)
          }
          uploading = false
        })
        .catch((err) => {
          alert(err.message || err)
          console.error(err) 
          uploading = false
        })
    } 

    const selectFile = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault()
      
      console.log('Select file clicked')
      var input = document.createElement('input');
      input.type = 'file';
      input.name = 'upload';
      input.onchange = e => upload(e)
      input.click();
    }
    // Add some new "handlers" for our autocomplete. The handlers object is
    // just a conventionally good place to put event handlers. Auto complete
    // inputs always have to deal with lots of keyboard events, so that logic
    // is registered here.
    Object.assign(node.context.handlers, {
      'selectFile': selectFile, 
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

}

const schema = [ 
  {
    if: '$value',
    then: [
      {
        if: '$baseUrl',
        then:[
          {
            $el: 'img',
            attrs: {
              id: '$id',
              src: '$baseUrl + $value',
              class: 'w-20',
            },
            children: ''
          }
        ],
        else:{
            $el: 'img',
            attrs: {
              id: '$id',
              src: '$value',
              class: 'w-20',
            },
            children: '',
        } 
      }
    ],
  }, 
  {   
    $el: 'input',
    attrs: {
      name: 'imageUrl',
      onInput: '$handlers.DOMInput',
      onBlur: '$handlers.blur',
      value: '$_value',
      class: 'formkit-input'
    },
  }, 
  {
    $el: 'a',
    attrs: {
      id: 'upload',
      href: '#',
      class: 'p-2',
      onClick: '$handlers.selectFile',
      title: 'Upload new'
    },
    children: [
      {
        $el:'svg',
        attrs:{
          xmlns:"http://www.w3.org/2000/svg",
          viewBox:"0 0 512 512",
          class: 'w-4'
        },
        children:[
          {
            $el: 'path',
            attrs:{
              d:"M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456c13.3 0 24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24z"
            }
          }
        ]
      }
    ]
  }, 
]
 
export const image = createInput(schema, {
  props: ['wrap', 'api', 'model', 'baseUrl'],
  features: [features],
})