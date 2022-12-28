import { defineStore } from "pinia";
import _ from 'lodash'
import { useAppContext } from "./global";
import { interpolate } from '~/libs/core/helpers' 

const { get, set, has } = _

export const useAuth = defineStore('Auth', {
    state: () => ({
      auth:{},
      session:{},
    }),
    actions: {
      setAuth ([session, value]) {
        this.session = { project: session, ...value }  
      },
      getAuth (session) {
        return this.session
      },
      authenticate({username, secret, remember}){
        try{  
          console.debug('store login')
          let $app = useAppContext()
          let { $axios } = useNuxtApp()
  
          if( !has($app.current, 'auth.url_login') ) 
            throw new Error('url login doest exist');

          return $axios({
                  url: get($app.current, 'auth.url_login'),
                  method: get($app.current, 'auth.url_method', 'post'),
                  data: {
                    [get($app.current, 'auth.field_username', 'email')]: username,
                    [get($app.current, 'auth.field_secret', 'password')]: secret,
                    [get($app.current, 'auth.field_remember', 'remember')]: remember,
                  },
                  headers: get($app.current, 'api.headers', {})
                  //{
                    //[get(this.config, 'request_token', 'access-token')]: ''
                  //}
                }, { wrap: false } )
          .then((res) => {
              let token = this.storageToken(res)
              let reqAuthData = this.authRequest(token)

              this.setAuth([ $app.current.code, { request: reqAuthData, logged: true, token }])
              return {token, logged: true, request: reqAuthData }
          })
        }catch(e){ 
          console.error(e)
          return Promise.reject(e)
        }
      },
      getToken(){
        let $app = useAppContext() 
        
        return sessionStorage.getItem(`${$app.current.code}_session`)
      },
      storageToken({data, headers}){
        let token = null
        let $app = useAppContext()

        this.config = $app.current.auth
        if( get(this.config, 'response_mode', 'body') === 'header' ){
          token = headers[ get(this.config, 'response_token', 'access-token') ];
        }else{
          token = get(data, get(this.config, 'response_token', 'access_token'), null)
        } 
  
        if( !token ) {
          return new Error ({message: 'token not found', config: this.config, data, headers})
        }
  
        sessionStorage.setItem(`${$app.current.code}_session`, token)
        return token
      },
      authRequest(token){
        let $app = useAppContext()
        this.config = $app.current.auth

        let tokenRequest = get(this.config, 'request_token_expression', '{token}')
        if( get(this.config, 'request_mode', 'header') == 'query' )
          return { 
            headers: get($app.current, 'api.headers', {}),
            params:{
                [get(this.config, 'request_token', 'access-token')] : interpolate(tokenRequest, {token})
            }
          } 
        else 
          return {
            headers:{
              ...get($app.current, 'api.headers', {}),
              [get(this.config, 'request_token', 'access-token')] : interpolate(tokenRequest, {token})
            }
          }
      },
      isLogged(){
        try{  
          console.log("isLogged")
          let $app = useAppContext()
          let { $axios } = useNuxtApp()
          this.config = $app.current.auth
          // let session = this.getAuth(app.current.code)
          //Check active session
          let token = sessionStorage.getItem(`${$app.current.code}_session`)
          if( !token )
            return Promise.reject({message: 'Token not exits'})

          if( get(this.session,'logged') )
            return Promise.resolve(this.session)
 
          if( !has(this.config, 'logged_url') ){
            return Promise.reject({message: 'Logged url not found'})
          }
          
          let reqAuthData = this.authRequest(token)
          
          let options = { 
            url: get(this.config, 'logged_url'), 
            method: 'get', 
            ...reqAuthData  
          }
  
          return $axios(options)
                  .then((data) => {
                      let user = this.setUser(data)
                      
                      this.setAuth([ $app.current.code, { user, request: reqAuthData, logged: true, token }])
                      return {token, user, request: reqAuthData }
                  })
        }catch(e){
          this.logout()
          return Promise.reject({message: e.message})
        }
      },
      setUser(data){ 
        let $app = useAppContext()
        this.config = $app.current.auth
        if( !has(this.config, 'logged_model') ) return {};
  
        let { id, name, username, role } = get(this.config, 'logged_model')
        let user = {
          "id": get(data, id, "id"),
          "name": get(data, name, "name"),
          "username": get(data, username, "email"),
          "role": get(data, role, "level")
        }
  
        return user;
      },
      logout(ctx){
        let $app = useAppContext()
        this.config = $app.current.auth

        let auth = { logged: false }
        let token = sessionStorage.getItem(`${$app.current.code}_session`)
        console.log("dispatched logout", token)
        if( token ){   
          sessionStorage.removeItem(`${$app.current.code}_session`)
        }
        this.setAuth([$app.current.code, auth]) 
        navigateTo('/auth/login')
      }, 
    }
})

