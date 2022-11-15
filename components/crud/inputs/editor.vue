<template>
  <div class="formkit-outer" :data-type="context.type" :class="[props.outerClass ?? '']">
    <span class="formkit-label" :class="[props.labelClass ?? '']" v-if="context.label">
      {{ context.label }}
    </span>
    <div class="formkit-wrapper" :class="[props.wrapperClass ?? '']">
      <ClientOnly >
        <QuillEditor 
          v-if="loaded"
          theme="snow"
          :toolbar="toolbar" 
          :modules="modules"
          :options="{placeholder: 'Compose an epic...'}"
          v-model:content="model"
          v-bind="context.attributes"
          contentType="html"
          @textChange="changeInput"
        /> 
      </ClientOnly>
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
const model = ref(context.value)
const loaded = ref(false)
const toolbar = ref([
  ['bold', 'italic', 'underline', 'strike'],        
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean','code-block','image'],
])
const modules = ref([])  
const props = computed(() => context.node?.props || {})
const hasMessages = computed(() => Object.keys(context?.messages || {}).length > 0 )

const changeInput = (content) => {
  // console.log("editor change", model.value)
  context.node.input(model.value)
}

onBeforeMount(async () => {
  let htmlEditButton = await import("quill-html-edit-button").then((mod) => mod.default)
  modules.value = [
    { 
      name: 'htmlEditButton',
      module: htmlEditButton, 
      options:{} 
    }
  ]

  loaded.value = true
})
</script>
 