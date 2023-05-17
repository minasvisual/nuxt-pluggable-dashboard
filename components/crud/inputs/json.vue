<template>
  <div class="formkit-outer" :data-type="context.type" :class="[props.outerClass ?? '']">
    <span class="formkit-label" :class="[props.labelClass ?? '']" v-if="context.label">
      {{ context.label }}
    </span>
    <div class="formkit-wrapper" :class="[props.wrapperClass ?? '']">
      <!-- <JsonEditor 
        mode="tree"
        v-model:json="jsonData"
        :queryLanguagesIds="['javascript']" 
        v-bind="context.attributes"
        @blur="setValue"
      /> -->
      <JsonEditor  
        mode="tree"
        v-model:text="jsonData" 
        @change="setValue"
      />
    </div>
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
  const jsonData = ref( typeof context?.value !== 'string' ? JSON.stringify(context?.value):context?.value );
   
  const props = computed(() => context.node?.props || {})
  const hasMessages = computed(() => Object.keys(context?.messages || {}).length > 0 )
  // function setValue (value) {
  //   console.log('value:', jsonData.value) 
  //   context.node.input(jsonData.value)
  // } 
  
  async function parsePromise (text) {
    return JSON.parse(text)
  }
  
  async function setValue (value) {
    console.log('value:', value)
    if( value.text ){
      let text = await parsePromise(value.text).catch(e => false)
      context.node.input( text ? text: jsonData.value )
    } else if( value.json )
      context.node.input(value.json)
 
  } 


</script>