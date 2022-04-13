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
    authenticate({username, secret, remember}){
      try{  
        let $store = useAuth()

        if( !has(this.current, 'auth.url_login') ) return new Error('url login doest exist');
        console.log(this.$nuxt.$axios)
        return this.$nuxt.$axios({
                        url: get(this.current, 'auth.url_login'),
                        method: get(this.current, 'auth.url_method', 'post'),
                        data: {
                          [get(this.current, 'auth.field_username', 'email')]: username,
                          [get(this.current, 'auth.field_secret', 'password')]: secret,
                          [get(this.current, 'auth.field_remember', 'remember')]: remember,
                        },
                        headers: get(this.current, 'api.headers', {})
                        //{
                          //[get(this.config, 'request_token', 'access-token')]: ''
                        //}
                      }, { wrap: false } )
                .then((res) => {
                  let token = this.storageToken(res)
                  let reqAuthData = this.authRequest(token)

                  $store.setAuth([ this.current.code, { request: reqAuthData, logged: true, token }])
                  return res
                })
      }catch(e){ 
        console.error(e)
        throw new Error(e)
      }
    },
    storageToken({data, headers}){
      let token = null
      this.config = this.current.auth
      if( get(this.config, 'response_mode', 'body') === 'header' ){
        token = headers[ get(this.config, 'response_token', 'access-token') ];
      }else{
        token = get(data, get(this.config, 'response_token', 'access_token'), null)
      } 

      if( !token ) {
        return new Error ({message: 'token not found', config: this.config, data, headers})
      }

      sessionStorage.setItem(`${this.current.code}_session`, token)
      return token
    },
    authRequest(token){
      this.config = this.current.auth
      let tokenRequest = get(this.config, 'request_token_expression', '{token}')
      if( get(this.config, 'request_mode', 'header') == 'query' )
        return { 
          headers: get(this.current, 'api.headers', {}),
          params:{
              [get(this.config, 'request_token', 'access-token')] : interpolate(tokenRequest, {token})
          }
        } 
      else 
        return {
          headers:{
            ...get(this.current, 'api.headers', {}),
            [get(this.config, 'request_token', 'access-token')] : interpolate(tokenRequest, {token})
          }
        }
    },
    isLogged(token){
      try{
        console.debug("isLogged", token)
        let $store = useAuth()
        this.config = this.current.auth
        if( !has(this.config, 'logged_url') ){
          return Promise.reject({message: 'Logged url not found'})
        }
        
        let reqAuthData = this.authRequest(token)
        console.debug("isLogged", reqAuthData)
        let options = { 
          url: get(this.config, 'logged_url'), 
          method: 'get', 
          ...reqAuthData  
        }

        return this.$nuxt.$axios(options)
                .then((data) => {
                    let user = this.setUser(data)
                    
                    $store.setAuth([ this.current.code, { user, request: reqAuthData, logged: true, token }])
                    return {token, user, request: reqAuthData }
                })
      }catch(e){
        return Promise.reject({message: e.message})
      }
    },
    setUser(data){
      this.config = this.current.auth
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
    message(message){
      alert(message)
    }
  }
})