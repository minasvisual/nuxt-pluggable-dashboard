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
  import './assets/tailwind.css' 
  import '@formkit/themes/genesis'
  import { useAppContext } from '~/store/global'
  const env = useRuntimeConfig()
  const app = useAppContext()
  const currentCookie = useCookie('current')

  const { data:projects } = await useAsyncData('data_projects', ({ $axios }) => {  
    return $axios.get(env.VUE_APP_BASE_API + env.VUE_APP_DATABASE).then( ({data}) => data )
  })
 
  app.projects = projects.value
  app.current = currentCookie.value ? _.find(app.projects, ['code', currentCookie.value]): _.get(app.projects, '[0]', {})
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