<template>
  <main>
    <Navbar />   
    <slot />
  </main>
</template> 

<script setup>  
import _ from 'lodash'
import { useAuth } from '~/store/auth'; 

const auth = useAuth() 
 
onMounted(async () => {
  try{
    if( !auth.getToken() )
     throw "Token não existe"

    if( auth.getToken() && !_.get(auth, 'session.logged', false)  )
      await auth.isLogged()
  }catch(e){
    console.log("logged error", e)
    // auth.logout()
    // navigateTo('/auth/login')
  }
})
</script>