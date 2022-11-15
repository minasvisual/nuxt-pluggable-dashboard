import { defineStore } from "pinia";
import { get, set, has } from 'lodash'
import { useAppContext } from "./global";
import { interpolate } from '~/libs/core/helpers' 

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
          let $app = useAppContext()
          let { $axios } = useNuxtApp()
  
          if( !has($app.current, 'auth.url_login') ) return new Error('url login doest exist');

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
          throw new Error(e)
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
  
          return this.$nuxt.$axios(options)
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
      //   increment(auth) {
      //       this.auth = auth;
      //   },  
      //   setAuth ([session, value]) {
      //     this[session] = value 
      //   },
      //   login ({ username, password, remember }) {
      //     let headers = process.env.VUE_APP_DEFAULT_HEADERS ? JSON.parse(process.env.VUE_APP_DEFAULT_HEADERS) : {}
      //     return this.$axios( 
      //       process.env.VUE_APP_LOGIN_URL , {
      //         method: 'POST',
      //         data: { 
      //           [process.env.VUE_APP_LOGIN_USER_FIELD]: username, 
      //           [process.env.VUE_APP_LOGIN_PASS_FIELD]: password,
      //           remember
      //         },
      //         headers
      //       }
      //     ).then( data => {
      //       let token =  get(data, process.env.VUE_APP_LOGIN_TOKEN_PATH, 'access_token' )
      //       localStorage.setItem('dash_session', token)
      //       this.setAuth(['dash', { isLogged: true, token }])
      //       this.$nuxt.redirect('/dashboard')
      //     }).catch( err => {
      //       alert('Login Error: '+ err.message)
      //     })
      //  },
      // isLogged(ctx){
      //   let token = localStorage.getItem('dash_session')
      //   if( token ){
      //     let headers = getAuthHeaders({ 
      //       "request_mode": process.env.VUE_APP_LOGIN_TOKEN_MODE || 'header',
      //       "request_token": process.env.VUE_APP_LOGIN_TOKEN_HEADER || 'access-token',
      //       "request_token_expression": process.env.VUE_APP_LOGIN_TOKEN_HEADER_EXPRESSION || '{token}', 
      //     }, token)
    
      //     return getUserData({ method: 'get', ...headers })
      //         .then( data => {
      //             ctx.commit('setAuth', ['dash', {isLogged: true, token, user: data }])
      //             if( !window.location.includes('dashboard') ) Router.push('/dashboard')
      //             return data
      //         })
      //         .catch(({response, message }) => {
                
      //           if( response && response.status > 400 && response.status < 410 )
      //             ctx.dispatch('logout')
    
      //           return { message, status }
      //         })
      //   }else{
          
      //     ctx.dispatch('logout')
      //     return Promise.reject({isLogged: false})
      //   }
      // },
      // logout(ctx){
      //   let auth = { isLogged: false }
      //   let token = localStorage.getItem('dash_session')
      //   console.log("dispatched logout", token)
      //   if( token ){   
      //       localStorage.removeItem('dash_session')
      //   }
      //   ctx.commit('setAuth', ['dash', auth]) 
      //   Router.push('/pages/login')
      // },
      // requestFail(ctx, { response }){
      //   let current = ctx.state.currentProject || {}
      //   console.log('request fail', response)
      //   if( get(response, 'config.url', '').includes(current.url) ){
      //     console.log(current)
      //     if( response.status == get(current, 'auth.request_expiration_status') || response.data.includes("expired") )
      //       ctx.dispatch('setAuth', [ current.code, {logged: false} ])
      //     else if( get(current, 'auth.use_system_auth') ){
      //       ctx.dispatch('logout')
      //     }
      //   }
      //   else if( get(response, 'config.url', '').includes( process.env.VUE_APP_LOGGED_URL ) ){
      //     ctx.dispatch('logout', { logged: false })
      //   }
    
      // },


    }
})

