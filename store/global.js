import { defineStore } from "pinia";
import { get, set, has } from 'lodash' 
import { interpolate } from '~/libs/core/helpers'
import { useAuth } from '~/store/auth'

export const useAppContext = defineStore('App', {
  state: () => ({
    projects:{},
    current:{}
  }),
  actions:{  
    message(message){
      alert(message)
    }
  }
})