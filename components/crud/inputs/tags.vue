<template>
   <div class="formkit-outer" :data-type="context.type" :class="[props.outerClass ?? '']">
    <span class="formkit-label" :class="[props.labelClass ?? '']" v-if="context.label">
      {{ context.label }}
    </span> 
    <section class="formkit-wrapper" :class="[props.wrapperClass ?? '']">
      <div class="tag-input"  v-if="valid"> 
        <div v-for='(tag, index) in model' :key='index' class='tag-input__tag'>
          <span @click='removeTag(index)'>x</span>    {{ tag }}
        </div>
        <input type='text' 
              v-bind="context.attributes" 
              placeholder="Type + Enter" 
              class='tag-input__text'
              @keydown.enter='addTag' 
              @keydown.188='addTag'
              @keydown.delete='removeLastTag'
        />
      </div>
      <p v-if="!valid">Invalid data</p>
    </section>
    <span class="formkit-help" :class="[props.helpClass ?? '']" v-if="context.help">
      {{ context.help }}
    </span>
    <ul class="formkit-messages" v-if="hasMessages"> 
      <li class="formkit-message" v-for="msg of context.messages" :key="msg.key">
        {{ msg.value }}
      </li>
    </ul>
  </div>
</template>

<script setup> 
  const { context } = defineProps(['context']) 
  const props = computed(() => context.node?.props || {})
  const valid = ref(true)
  const model = ref([])
 
  function checkFormat(data){
        if( data === null || data === undefined) {
          model.value = []  
          valid.value = true
        } else if( typeof data == 'string' && ['[',']'].includes(data) ){
            try {
                model.value = JSON.parse(data);
                valid.value = true
            } catch (e) {
                valid.value = false;
            }
        } else{
            valid.value = false;
        }
  }
  function addTag (event) {
      event.preventDefault()
      var val = event.target.value.trim()
      if (val.length > 0) {
        model.value.push(val)
        event.target.value = ''
        changeData(model.value)
      }
  }
  function removeTag (index) {
      model.value.splice(index, 1)
      changeData(model.value)
  }
  function removeLastTag(event) {
      if (event.target.value.length === 0) {
        removeTag(model.value.length - 1)
        
        changeData(model.value)
      }
  }
  function changeData(data){ 
    if( context.output && context.output == 'json')
      context.node.input(JSON.stringify(data))
    else
      context.node.input(data)
    console.debug('value:', data)  
  }

  onMounted(() => {
    checkFormat(context.value)
  })
</script> 
 
<style scoped>
.tag-input {
  width: 100%;
  border: 1px solid #eee;
  font-size: 0.9em; 
  box-sizing: border-box;
  padding: 0 10px;
  display: flex;
}
.tag-input__tag { 
  /* float: left; */
  display: flex;
  margin-right: 10px;
  background-color: #eee;
  margin-top: 5px;
  line-height: 30px;
  padding: 0 5px;
  border-radius: 5px;
}
.tag-input__tag > span {
  cursor: pointer;
  opacity: 0.75;
  margin-right: 10px;
}
.tag-input__text {
  border: none;
  outline: none;
  font-size: 0.9em; 
  background: none;
  max-width: 120px; 
}
</style>