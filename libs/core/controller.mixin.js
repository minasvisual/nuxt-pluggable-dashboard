import { has, get, } from "lodash";
import { loadModel, getData, saveData, deleteData } from "./models";
import { formatOutput, getErrorMessage, sendType } from "./helpers";

export default {
  data(){
    return{
      active:{},
      renderComponent: false
    }
  },
  computed:{ 
    hasAuth() {
      return has(this.currentProject, 'auth');
    },
    currentProject(){
      return this.$store.state.currentProject || null
    }, 
    request(){
      return get(this.$store, `state.auth.${this.currentProject.code}.request`, {})
    }, 
  },
  methods: {
    async loadModel(opts) {
      try{
          if (!has(this.currentProject, "resources")) return console.debug('sem projeto definido');

          if (
            has(this.$route, "params.model") &&
            has(this.currentProject, `resources[${this.$route.params.model}]`)
          ) {
            this.$store.commit('setLoader', ['model', true])
            this.loading = true
            let url = this.currentProject.resources_path + get( this.currentProject, `resources[${this.$route.params.model}.resource]`)

            return await loadModel(url, opts).then((data) => {
                if( !data.title ) throw {message: 'JSON parse fails'}; 

                this.active = data
                console.debug('Load model '+ data.title, data)
                //if (this.active.auth) this.logged = false;

                if( this.renderComponent === true ) this.forceRerender()
                else this.renderComponent = true;
                
                this.$store.commit('setSchema', [this.active.domain, false])
                this.$store.commit('setLoader', ['model', false])
                return data;
            })
          } else {
            this.$message("Model " + this.$route.params.model + " doesnt exist");
            this.$router.push("/dashboard");
          }
      }catch(err){
        console.error('Catch load model', err)
        this.$store.commit('setLoader', ['model',  false])
        this.loading = false;
        this.renderComponent = false
        this.$message("Error to load Model " + this.$route.params.model +" : "+ getErrorMessage(err));
      }
    },
    loadModelByUrl(url, opts){
        return loadModel(url, opts).then((data) => {
          if( !data.api ) throw {message: 'JSON parse fails'}; 
          
          return data;
      })
    },
    getData(schema, options){
      this.hooksRun('before:get', options)
      return getData(schema, options).then( data => {
        this.hooksRun('after:get', data) 
        return data
      })
    },
    saveData(schema, data){
      this.$store.commit('setLoader', ['form', true])
      data = formatOutput(schema.properties, data)
         
      if( data.id )
        this.hooksRun('before:update', data)
      else
        this.hooksRun('before:create', data)

      return saveData(schema, data)
        .then((res) => {
            this.$message('Saved with success') 

            if( data.id )
              this.hooksRun('after:update', data)
            else
              this.hooksRun('after:create', data)

            return res
        }) 
        .catch(e => {
          this.$message( getErrorMessage(e) )
          this.$bus.$emit(`${schema.domain}:error`, e)
          return Promise.reject(e)
        })
        .finally(() => {
          this.$store.commit('setLoader', ['form', false])
        })
    },
    deleteData(schema, data){
      //this.active.api = Object.assign(this.active.api, ...this.request); 
      this.$store.commit('setLoader', ['table', true])
       
      this.hooksRun('before:delete', data) 

      return deleteData(schema, data)
          .then((data) => { 
              this.hooksRun('after:delete', data) 
              return data;
          })
          .catch(e => { 
            this.$message( getErrorMessage(e) )
            return Promise.reject(e)
          }).finally(() =>{
            this.$store.commit('setLoader', ['table', false])
          })
    },  
    forceRerender() {
      console.debug('called rerender')
      this.renderComponent = false;

      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
    errors(data) {
      this.$message( getErrorMessage(data) );
      console.error("error", data);
      
      this.$store.commit('setLoader', ['form', false])
      this.$store.commit('setLoader', ['table', false])
    },
    hooksRun(target, data){
      let hooks = get(this.schema, 'hooks', []).filter(i => target == i.target )

      for(let act of hooks){
        if( act.handler ){
          console.debug("hooksRun Called", target, data)
          this.$bus.$emit(act.handler, sendType({ action: act}, data, data[(act.id || this.primaryKey)]) )
        }
      }
    },
    // Standalone grid
    get:get
  },
};
