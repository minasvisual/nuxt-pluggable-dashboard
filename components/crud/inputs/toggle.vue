<template>
  <div class="formkit-outer" :data-type="context.type" :class="[props.outerClass ?? '']">
    <span class="formkit-label" :class="[props.labelClass ?? '']" v-if="context.label">
      {{ context.label }}
    </span> 
    <div class="formkit-wrapper flex items-center cursor-pointer cm-toggle-wrapper"  
          @click="setValue" :class="[props.wrapperClass ?? '']">
      <span class="font-semibold text-xs mr-1">
          Off
      </span>
      <div class="rounded-full w-10 h-6 p-0.5 bg-gray-300" :class="{'bg-red-500': !model,'bg-green-500': model}">
          <div class="rounded-full w-5 h-5 bg-white transform mx-auto duration-300 ease-in-out" :class="{'-translate-x-2': !model,'translate-x-2': model}"></div>
      </div>
      <span class="font-semibold text-xs ml-1">
          On
      </span>
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
  const props = computed(() => context.node?.props || {})
  const model = ref(context.value ?? false)

  function setValue (value) {
    console.log('value:', model.value) 
    model.value = !model.value
    context.node.input(model.value)
  } 
</script> 