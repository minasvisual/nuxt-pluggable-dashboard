<template> 
  <main>
    <NuxtPage />

    <CommonsModal v-model:show="formopen" >
      <div v-if="app?.alert?.message" v-html="app.alert?.message"></div>
    </CommonsModal>
  </main>
</template>

<script lang="ts" setup> 
  import _ from 'lodash'
  import 'jodit/build/jodit.min.css'
  import './assets/tailwind.css' 
  import '@formkit/themes/genesis'
  import { useAppContext } from '~/store/global'
  const env = useRuntimeConfig()
  const app = useAppContext()
  const currentCookie = useCookie('current') 

  const resolveCurrent = () => {
    let result = _.get(app.projects, '[0]', {})
 
    if( _.some(app.projects, ['domain', hosting.value.host]) ){
      result = _.find(app.projects, ['domain', hosting.value.host])
    }else if ( currentCookie.value ) {
      result = _.find(app.projects, ['code', currentCookie.value])
    } else {
      result = _.get(app.projects, '[0]', {})
    } 

    return result
  }

  const { data:hosting } = await useAsyncData(({ ssrContext }): any => {  
    return { host: ssrContext?.event.req.headers.host }
  })

  const { data:projects } = await useAsyncData('data_projects', ({ $axios }) => {  
    return $axios.get(env.public.VUE_APP_BASE_API + env.public.VUE_APP_DATABASE, {
      headers: JSON.parse(_.get(env.public, 'VUE_APP_DATABASE_HEADERS', '{}'))
    }).then(  ({data}) =>  {
      console.log(_.get(data,  env.public.VUE_APP_DATABASE_WRAPDATA))
        return (env.public.VUE_APP_DATABASE_WRAPDATA ? _.get(data,  env.public.VUE_APP_DATABASE_WRAPDATA, data):data )
    }).catch(e => console.error(_.get(e, 'response.data', e)))
  })
 
  app.projects = projects.value 
  app.current = resolveCurrent()
</script>

<style lang="scss">
html, body, #__nuxt {
  @apply bg-gray-50 dark:bg-gray-800;
  width: 100%;
  height: 100%;
}
.global-text {
  @apply text-gray-900 dark:text-gray-50;
}
</style>