<template >
  <section class="content text-center" >
    <slot v-if="login" v-bind:schema="schema">
      vazio
    </slot>
    <div  v-else class="w-1/3 mx-auto">
        <h3 v-if="loading" class="text-center">Authenticating...
          SPINNER
        </h3>
        <FormKit 
          v-else
          type="form"
          method="post"
          v-model="model"
          @submit="doAuth"
          :actions="false"
          #default="{ hasErrors }"
        >

          <h4 class="text-center">Project Authentication</h4>
          
          <FormKit  type="text" name="username" placeholder="Username" /> 

          <FormKit  type="password" name="secret"  placeholder="Password" /> 

          <FormKit  type="checkbox" name="remember" label="remember" /> 

          <div class="action-buttons mt-3">
            <button
                type="button"
                color="danger"
                class="mr-2"
                @click="$emit('close', { refresh: false })"
              >
                  Cancel
            </button>
            <button
                type="submit"
                color="success"
                :disabled="hasErrors"
              >
                  Send
            </button>
          </div>
        </FormKit>
    </div>

  </section>
</template>

<script setup> 
import { has, get, merge } from 'lodash'
import { getErrorMessage } from '~/libs/core/helpers'
// import SessionMixin from '~/libs/core/session.mixin'
import { useAuth } from '~/store/auth' 
import { useAppContext } from '~/store/global' 

  const auth = useAuth(); 
  const app = useAppContext(); 
  let loading = ref(false)
  let model = ref({})
  let login = ref(false)
  let hasAuth = computed(() => {
    return !!app.current.auth
  })
  let session = computed(() => {
    return get(auth, `[${app.current.code}]`, {})
  })

  const emit = defineEmits(['auth:failed','auth:logged'])

  const { schema, project } = defineProps({
    schema: {
      type: Object,
      default: () => ({ properties: [] })
    }, 
    project: {
      type: Object,
      default: () => ({})
    }, 
  })
 
  // },
  // props:{
  //     project:{
  //       type: Object,
  //       default: () => ({})
  //     },
  //     schema:{
  //       type: Object,
  //       default: () => ({})
  //     }
  // }, 
  // methods:{
  const doAuth = (form) => {
    try{
      loading.value = true;
      return app.authenticate(form)
                .then(success)
                .catch(error)
    }catch(e){
      app.message( getErrorMessage(e) ) 
      loading.value = false;
    }
  }
  const success = function(res){
      let token = app.storageToken(res)
      let { data, headers } = res;

      if( !token ) {
        loading.value = false;
        return emit('auth:failed', {message: 'token not found', config, data, headers})
      }
      let authRequest = app.authRequest(token)
      
      emit('auth:logged', { logged: true, request: authRequest })
      loading.value = false;
      login.value = true;
                  
  }
  const error = function({ response, message, ...data }){
    app.message( getErrorMessage({ response, message, ...data }) )
    console.log('Auth Error', message, response, data)
    loading.value = false;
    
    emit('auth:failed', {message})
  }
  const checkLogged = async function (token){
    try{
      let auth = await app.isLogged(token)
      console.debug('checkLogged: isLogged', auth)
      
      emit('auth:logged', auth)

      return auth
    }catch(e){
      console.debug('checkLogged failed: token', e)
      app.message( getErrorMessage(e) )
      login.value = false;
      return emit('auth:failed', {message: e.message})
    }
  }
  //   logout(){
  //     console.debug("called auth logout")
  //     this.loading = true;
  //     return this.doLogout().then(() => {
  //       this.loading = false;
  //       this.login = false;
  //     })
  //   }
  // },
  // beforeMount(){
  //   this.login = false
  // },
  
  provide('sessions', auth) 
  provide('project', app.current) 

  onMounted(async () => {
    try{
      schema.api = merge(get(app.current, 'api', {}), schema.api)

      console.debug('caled mounted auth')
      if( !hasAuth.value ) return login.value = true 

      console.debug('auth process start')
      let token = sessionStorage.getItem(`${schema.session || app.current.code}_session`)
      console.debug('token session', token)

      loading.value = true;
      if( token && get(session, 'logged', false) ){
        emit('auth:logged', {token, user: get(session, 'user', {}), request: app.authRequest(token) })
        
        console.debug('token and user exists', app.authRequest(token), session)
        schema.api = Object.assign(schema.api, app.authRequest(token))
        loading.value = false;
        login.value = true;
      }else if( token ){
        let { request={}, ...data } = await checkLogged(token)

        console.debug('token exists relogin', request, data)
        schema.api = Object.assign(schema.api, request)
        
        loading.value = false;
        login.value = true;
      }else{
        loading.value = false;
        login.value = false;
        console.debug('show login form')

      } 
    }catch(e){
      login.value = false;
      loading.value = false;
      console.log('erro mounted auth', e)
      emit('auth:failed', e)
      app.message( getErrorMessage(e) )
    } 
  })
// }
</script>