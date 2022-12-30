<template>
  <NuxtLayout name="logged" >
    <section class="content m-1 md:mx-12">
      <div class="nav flex p-2 gap-4">
        <button type="button" @click="view = 'schema'">Schema</button>
        <button type="button" @click="view = 'form'">Form</button>
        <button type="button" @click="view = 'table'">Table</button> 
        <button type="button" @click="view = 'htmljson'">HTML To JSON</button> 
      </div>
      <div class="tabs">
        <div class="form flex gap-4 w-full" v-if="view == 'schema' && model"> 
          <div class="w-2/3">
            <div class="text-right">
              <button class="text-blue-500 p-1 " type="button" @click="rerender">Reload Schema</button>
              <select value="" class="text-blue-500 p-1 " @change="loadPage">
                <option value="" readonly>Load model</option>
                <option v-for="(rsc, key) of current.pages" :key="key" :value="key">{{ rsc.label || rsc.resource }}</option>
              </select>
            </div>
            <FormKitSchema :schema="model.properties || model" />
          </div>
          <div class="w-1/3">
            <JsonEditor  
              mode="tree"
              :value="model"
              :queryLanguagesIds="['javascript']"  
              @change="setValue"
            />
          </div>
        </div>
        <div class="form flex gap-4 w-full" v-if="view == 'form' && model"> 
          <div class="w-2/3">
            <div class="text-right">
              <button class="text-blue-500 p-1 " type="button" @click="rerender">Reload Form</button>
              <select value="" class="text-blue-500 p-1 " @change="loadResource">
                <option value="" readonly>Load model</option>
                <option v-for="(rsc, key) of current.resources" :key="key" :value="key">{{ rsc.label }}</option>
              </select>
            </div>
            <CrudForm v-if="render" :model="model" :data="row" />
          </div>
          <div class="w-1/3">
            <JsonEditor  
              mode="tree"
              :value="model"
              :queryLanguagesIds="['javascript']"  
              @change="setValue"
            />
          </div>
        </div>
        <div class="form" v-if="view == 'table'"> 
          <CrudTable :resource="rows" />  
        </div>
        <div class="form" v-if="view == 'htmljson'"> 
          <CrudCommonHtmlToJson />  
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
  import _ from 'lodash'  
  import { FormKit, FormKitSchema } from '@formkit/vue'
  import { useAppContext } from '~/store/global';
  const envs = useRuntimeConfig()
  const { $axios, $message } = useNuxtApp()
  const { current={} } = useAppContext() 
  const view = ref('schema') 
  const model = ref({
    "properties":[]
  })
  const rows = ref([])
  const row = ref({})
  const render = ref(true)

  async function parsePromise (text) {
    return JSON.parse(text)
  }

  async function setValue (value) {
    console.log('value:', value)
    if( value.text ){
      let text = await parsePromise(value.text).catch(e => false)
      model.value = text ? text: model.value
    } else if( value.json )
      model.value = value.json
 
  } 

  function rerender () {
    render.value = false
    nextTick(() => {
      render.value = true
    })
  }

  async function loadResource (e) {
    console.log(e)
    if( !e?.target?.value ) return;
    model.value = await $axios.get(
      `${envs.public.VUE_APP_BASE_API}${current.resources_path}${ _.get(current, `resources[${e?.target?.value}].resource`, '404') }`)
      .then( ({data}) => data )
  }
  async function loadPage (e) {
    console.log(e)
    if( !e?.target?.value ) return;
    model.value = await $axios.get(
      `${envs.public.VUE_APP_BASE_API}${current.resources_path}${ _.get(current, `pages[${e?.target?.value}].resource`, '404') }`)
      .then( ({data}) => data )
  }
</script>