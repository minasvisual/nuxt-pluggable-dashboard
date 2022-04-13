import { defineStore } from "pinia";
import { get, set } from 'lodash'

export const useAuth = defineStore('Auth', {
    state: () => ({
      auth:{},
      session:{},
    }),
    actions: {
        increment(auth) {
            this.auth = auth;
        },  
        setAuth ([session, value]) {
          this[session] = value 
        },
        login ({ username, password, remember }) {
          let headers = process.env.VUE_APP_DEFAULT_HEADERS ? JSON.parse(process.env.VUE_APP_DEFAULT_HEADERS) : {}
          return this.$axios( 
            process.env.VUE_APP_LOGIN_URL , {
              method: 'POST',
              data: { 
                [process.env.VUE_APP_LOGIN_USER_FIELD]: username, 
                [process.env.VUE_APP_LOGIN_PASS_FIELD]: password,
                remember
              },
              headers
            }
          ).then( data => {
            let token =  get(data, process.env.VUE_APP_LOGIN_TOKEN_PATH, 'access_token' )
            localStorage.setItem('dash_session', token)
            this.setAuth(['dash', { isLogged: true, token }])
            this.$nuxt.redirect('/dashboard')
          }).catch( err => {
            alert('Login Error: '+ err.message)
          })
       },
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

