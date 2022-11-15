import _ from 'lodash'
import { createApp } from 'vue'
import Alert from '~/components/commons/alert.vue'

export default defineNuxtPlugin((nuxtApp) => { 

  // const instance = createApp(Modal)
 
  // instance.mount(document.createElement('div'))
  
  // 4. adicionar um método de instância
  const message = function (msg, type='info', timeout=5) {  
      const close = () => {
        let doc = document.querySelector('.alert-wrap')
        if(doc) doc.remove()
      }
      let div = document.createElement('div')
      div.className = 'alert-wrap'
      
      var instance = createApp(Alert, { msg, type, expire: timeout * 1000 , close })  
      instance.mount(div) // pass nothing
      // this.$refs.container.appendChild(instance._container)    
    // alguma lógica ...
      document.body.appendChild(div)
      // alert logic
      // instance.type = type
      // instance.msg = `<div class="card">
      //   <div class="card-body">
      //     ${msg}
      //   </div>
      // </div>`
      // instance.isShow = true
      // instance.persistent = true
      // instance.instance = instance 
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