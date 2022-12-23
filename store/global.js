import { defineStore } from "pinia";
import _ from 'lodash'  
import Cookie from 'js-cookie'

export const useAppContext = defineStore('App', {
  state: () => ({
    projects:{},
    current:{}
  }),
  actions:{  
    message(message){
      alert(message)
    },
    loadModel(file){ 
      let { $axios } = useNuxtApp() 
      console.log('loadModel', file)
      return $axios.get(`${this.current.resources_path}${ _.get(this.current, `resources[${file}].resource`, '404') }`)
                  .then( ({data}) => data )
                  .catch(console.error)
    },
    setCurrent(code){
      console.log('setCurrent', code)
      let curr = this.projects.find(p => p.code == code)
      if( !curr ) return console.error('setcurrent errpr', code)

      this.current = curr
      Cookie.set('current', code)
    }
  }
})