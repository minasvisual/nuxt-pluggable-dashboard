<template >
  <section class="content text-center" >
    <section v-if="login"> 
      <slot v-bind:schema="schema">
        vazio
      </slot>
    </section>
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

          <h4 class="text-center py-4">Project Authentication</h4>
          
          <FormKit  type="text" name="username" placeholder="Username" /> 

          <FormKit  type="password" name="secret"  placeholder="Password" /> 

          <FormKit  type="checkbox" name="remember" label="remember" /> 

          <div class="action-buttons mt-3 flex gap-4">
            <button
                type="button"
                color="danger"
                class="py-2 px-4 border bg-red-800 text-white rounded hover:text-gray-400"
                @click="$emit('close', { refresh: false })"
              >
                  Cancel
            </button>
            <button
                type="submit"
                color="success"
                class="py-2 px-4 border bg-green-800 text-white rounded hover:text-gray-400"
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
  import _ from 'lodash'
  import { getErrorMessage } from '~/libs/core/helpers'
  // import SessionMixin from '~/libs/core/session.mixin'
  import { useAuth } from '~/store/auth' 
  import { useAppContext } from '~/store/global' 

  const { has, get, merge } = _
  const auth = useAuth(); 
  const app = useAppContext(); 
  let loading = ref(false)
  let model = ref({})
  let login = ref(false)
  let schema = inject('model')
  let project = computed(() => app.current)


  let hasAuth = computed(() => {
    return !!app.current?.auth
  })
  let session = computed(() => {
    return get(auth, `[${app.current?.code}]_session`, {})
  })

  const emit = defineEmits(['auth:failed','auth:logged'])

  // const { schema, project } = defineProps({
  //   schema: {
  //     type: Object,
  //     default: () => ({ properties: [] })
  //   }, 
  //   project: {
  //     type: Object,
  //     default: () => ({})
  //   }, 
  // })
 
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
      return auth.authenticate(form)
                .then(success)
                .catch(error)
    }catch(e){
      app.message( getErrorMessage(e) ) 
      loading.value = false;
    }
  }
  const success = function(res){ 
      let { token, request,  ...data } = res;

      if( !token ) {
        loading.value = false;
        return emit('auth:failed', {message: 'token not found', config, data, headers: request.headers })
      } 
      
      emit('auth:logged', { logged: true, request })

      nextTick(() => {
        loading.value = false;
        login.value = true;
      })
  }
  const error = function({ response, message, ...data }){
    app.message( getErrorMessage({ response, message, ...data }) )
    console.log('Auth Error', message, response, data)
    loading.value = false;
    
    emit('auth:failed', {message})
  }
  const checkLogged = async function (token){
    try{
      let logged = await auth.isLogged(token)
      console.debug('checkLogged: isLogged', logged)
      
      emit('auth:logged', logged)

      return logged
    }catch(e){
      console.debug('checkLogged failed: token', e)
      app.message( getErrorMessage(e) )
      login.value = false;
      return emit('auth:failed', {message: e.message})
    }
  }
  const logout = () => {
    console.debug("called auth logout")
    loading.value = true;
    return  auth.logout().then(() => {
      loading = false;
      login = false;
    })
  } 

    
  provide('session', session) 
  provide('project', app.current) 

  onBeforeMount(() => {
    login.value = false
  })
  onMounted(async () => {
    try{
      schema.value.api = merge(get(app.current, 'api', {}), schema.value.api)

      console.debug('caled mounted auth')
      if( !hasAuth.value ) return login.value = true 

      console.debug('auth process start')
      let token = sessionStorage.getItem(`${schema.value.session || app.current.code}_session`)
      console.debug('token session', token)

      loading.value = true;
      if( token && get(session, 'logged', false) ){
        emit('auth:logged', {token, user: get(session, 'user', {}), request: auth.authRequest(token) })
        
        console.debug('token and user exists', auth.authRequest(token), session)
        schema.value.api = Object.assign(schema.value.api, auth.authRequest(token))
        loading.value = false;
        login.value = true;
      }else if( token ){
        let { request={}, ...data } = await checkLogged(token)

        console.debug('token exists relogin', request, data)
        schema.value.api = Object.assign(schema.value.api, request)
        
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