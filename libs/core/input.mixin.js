import { getDataObject, getData, loadModel } from './models'
import { filterParams, mergeDeep, interpolate } from './helpers'
import { get, set } from 'lodash'

export default { 
  data () {
    return { 
      loading: false, 
      renderComponent: false,
      options: []
    }
  },
  computed: { 
    model () {
      return this.context.model
    }, 
    attributes () {
      return this.context.attributes || {}
    }, 
    currentProject(){
      return this.$store.state.currentProject || null
    }, 
    request(){
      return get(this.$store, `state.auth.${this.currentProject.code}.request`, {})
    },  
    formValues(){
      return this.$store.state.crud.row || {}
    }
  },
  methods:{
    forceRerender() {
      this.renderComponent = false;

      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
    requestModel(schema, data, opts){
      try{
        let { api = {} } = schema 
        
        if( api.rootApi ){
          this.loading = true;
          schema.api = Object.assign(schema.api, this.request)

          schema.api = filterParams( ( schema.api || {} ), data )

          return getDataObject(schema, data, opts).then((data) => {
            this.loading = false; 
            return data
          })
        }else{
          return Promise.reject({"message": "required rootApi"})
        }
      }catch(e){
          console.log('Erro select input', e)
          return Promise.reject({"message": "required rootApi"})
      }
    },
    convertAttributesToSchema(attr){
      return {
        rootApi: get(attr, 'url'),
        wrapData: get(attr, 'wrapData'),
        fieldLabel: get(attr, 'fieldLabel'),
        fieldValue: get(attr, 'fieldValue'),
        ...get(attr, 'requestOptions', {})
      }
    },
    async loadNestedSchema(schema){
      if( schema && typeof schema  == 'string' )
        return loadModel( this.currentProject.resources_path + schema).then( data =>  { 
          if( !data || !data.api ) throw { message: "Api fail" } 
          return data
        }).catch( () => ({}) )
      else
        return schema
    },
    async getOptions({ rootApi, fieldLabel, fieldValue, ...data }, model = {}, filter={}){
      try{ 
        console.debug("input mixin get options", { rootApi, fieldLabel, fieldValue, ...data })
        if( rootApi ){
          this.loading = true;
          data = mergeDeep(data, this.request)
          if( typeof filter == 'object' )
            data = mergeDeep(data, filter)

          rootApi = interpolate(rootApi, { data: model })
          let { rows } = await getData({ api: { ...data, rootApi, resource: this.formValues } }, { data: model }) 

         this.options = rows && rows.map((i, k) => ({ 
              label: get(i, fieldLabel, i.toString()), 
              value: get(i, fieldValue, k)
            }) 
          )
          
          this.loading = false;
          this.forceRerender()
          return this.options
        }
      }catch(e){
          alert('Erro to get data from '+ rootApi)
          console.error('Erro select input', e)
          return this.options
      }
    },
    transformSchema(schema){
      schema.api = mergeDeep( get(schema, 'api', {}), this.request) 

      if( get(schema, 'api.bypassGetData', false) )
          this.resource = this.formValues[this.name]
      else
          this.resource = this.formValues

      schema.api.resource = this.resource
          
      return schema
    }
  },

 }