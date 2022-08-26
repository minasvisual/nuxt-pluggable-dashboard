import _ from 'lodash'
import {createApp} from 'vue'
import Modal from '~/components/commons/modal.vue'

export default defineNuxtPlugin((nuxtApp) => { 

  // const instance = createApp(Modal)
 
  // instance.mount(document.createElement('div'))
  
  // 4. adicionar um método de instância
  const message = function (msg, type='info', timeout=3) {
    // alguma lógica ...
      document.body.appendChild(instance.$el)
      // alert logic
      instance.type = type
      instance.msg = `<div class="card">
        <div class="card-body">
          ${msg}
        </div>
      </div>`
      instance.isShow = true
      instance.persistent = true
      instance.instance = instance

      setTimeout(() => instance.isShow = false, timeout * 1000)
  }
  
  const modal = (msg, options={}) => {
      console.error("Chamado modal antigo")
      // document.body.appendChild(CompB.$el)
      // alert logic
      // instance._data.type = 'alert'
      // instance._data.msg = msg
      // instance._data.isShow = true
      // instance._data.instance = instance 
  }

  nuxtApp.vueApp.config.globalProperties.$modal = modal
  nuxtApp.vueApp.config.globalProperties.$message = message 
    
  return {
    provide: {
      message,
      modal
    }
  }
})