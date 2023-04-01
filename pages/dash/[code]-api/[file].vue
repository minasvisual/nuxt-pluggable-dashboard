<template>
  <NuxtLayout name="logged" >
    <section class="content m-1 md:mx-12" v-if="model"> 
      <CrudAuth @auth:logged="doLogged" #default="{ methods }">
        <CommonsModal v-model:show="form.__isOpen" :title="false" > 
          <CrudForm :model="model" :data="form" 
                    @saved="e =>postActions('saved', e)" 
                    @cancel="e =>postActions('cancel', e)" 
          />
        </CommonsModal>

        <CrudTable :resource="resource" @create="actions" @edit="actions" @delete="actions">
          <template #toolbar-center>
            <span>{{  model.title }}</span>
          </template>  
          <template #toolbar-right>
            <div >
              <button v-if="current.auth" class="border" @click="methods.logout"><LogoutIcon class="h-6"/></button>
            </div>
          </template>
        </CrudTable>
      </CrudAuth>
    </section>
    <section v-else>
      <p class="text-center p-4">PAGE ERROR {{ error }}</p>
    </section>
  </NuxtLayout>
</template>

<script setup>
  import { LogoutIcon } from '@heroicons/vue/solid'
  import _ from 'lodash'   
  import { useAppContext } from '~/store/global';
  import Resource from '~/libs/core/resource'
  const { $axios, $message, $bus } = useNuxtApp()
  const { current={} } = useAppContext() 
  const env = useRuntimeConfig()
 
  let Instance = Resource({ $axios })
  let route = useRoute() 

  let { data:model, error } = await useAsyncData('model_'+route.params.file, ({ $axios }) => {  
    let baseModelPath = current.resources_path?.includes('http') ? '': env.public.VUE_APP_BASE_API
    return $axios.get(
      `${baseModelPath}${current.resources_path}${ _.get(current, `resources[${route.params.file}].resource`, '404') }`,{
      headers: JSON.parse(_.get(env.public, 'VUE_APP_DATABASE_HEADERS', '{}'))
    }).then( ({data}) => data )
  })

  provide('model', model)  
   
  let form = ref({}) 
  let resource = ref([]) 

  let actions = ({ target, row }) => { 
    row = JSON.parse(JSON.stringify(row))
    // Instance.setModel(JSON.parse(JSON.stringify(model.value)))

    if( target == 'delete' ){
      console.debug("fiel deleted ") 
    }else{
      form.value = { ...row, __isOpen:true } 
    }
  }

  let postActions = (type) => {
    if( type == 'saved' ){
      form.value = {}
      $bus.emit('table:refresh', {})
    } 
  }

  const doLogged = ({ request }) => {
    _.set(model.value, 'api', {...model.value.api, ...request })
    
    // Inst.setModel(model.value)
  }
  
  // watch(route.params.file, async () => {
  //   console.error("watch file", route.params)
  //   model.value = await $axios.get(`${current.resources_path}${ _.get(current, `resources[${route.params.file}].resource`, '404') }`).then( ({data}) => data )

  //   getDatasource()
  // })
  
  onMounted(async() => {
    try { 
      // model.value = await $axios.get(`${env.public.VUE_APP_BASE_API}${current.resources_path}${ _.get(current, `resources[${route.params.file}].resource`, '404') }`).then( ({data}) => data )

      console.debug("controller mounted", model.value)

      Instance.setModel(JSON.parse(JSON.stringify(model.value))) 
    } catch (error) {
      console.error("onmounted", error)
    }
  })

  onUnmounted(async () => {
    try { 
      console.debug("controller unmounted", model.value)
    } catch (error) {
      console.error("onunmounted", error)
    }
  })
</script>