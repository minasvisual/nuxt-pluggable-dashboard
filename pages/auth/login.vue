<template >
  <NuxtLayout class="content" >
    <section class="content" > 

      <div class="w-1/3 mx-auto p-4">
          <h3 v-if="!auth.session.logged && loading" class="text-center">Authenticating...
            SPINNER
          </h3>
          <h3 v-if="auth.session.logged && !loading" class="text-center">Authenticating...
            {{ auth.session }}
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

            <h4 class="text-center mb-4">Project Authentication</h4>
            
            <FormKit  type="text" name="username" placeholder="Username" validation="required" /> 

            <FormKit  type="password" name="secret"  placeholder="Password" validation="required" /> 

            <FormKit  type="checkbox" name="remember" label="remember" /> 

            <div class="action-buttons mt-3 flex justify-between">
              <button
                  type="submit"
                  class="flex px-3 py-2 bg-blue-500 mr-1 font-semibold rounded bg-blue-500"
                  :disabled="hasErrors"
                >
                    Send
              </button>
            </div>
          </FormKit>
      </div>

    </section>
  </NuxtLayout>
</template>

<script setup>  
  import _ from 'lodash'
  import { getErrorMessage } from '~~/libs/core/helpers'; 
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

  const emit = defineEmits(['auth:failed','auth:logged'])
 
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
      emit('auth:logged', auth.session)
      loading.value = false;
      login.value = true; 
      navigateTo('/dash/home')
  }

  const error = function({ response, message, ...data }){
    app.message( getErrorMessage({ response, message, ...data }) )
    console.log('Auth Error', message, response, data)
    loading.value = false;
    
    emit('auth:failed', {message})
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
    
  onMounted(async () => {
    try{ 
      loading.value = true;
      if( auth.getToken() && !_.get(auth, 'session.logged', false)  ){
        await auth.isLogged().then(success) 
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