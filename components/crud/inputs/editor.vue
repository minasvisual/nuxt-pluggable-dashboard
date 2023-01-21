<template>
  <div class="formkit-outer" :data-type="context.type" :class="[props.outerClass ?? '']">
    <span class="formkit-label" :class="[props.labelClass ?? '']" v-if="context.label">
      {{ context.label }}
    </span>
    <div class="formkit-wrapper" :class="[props.wrapperClass ?? '']"> 
        <textarea :class="loaded ? 'block':'hidden'" ref="element"></textarea> 
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
import 'jodit/build/jodit.min.css'

const { context } = defineProps(['context'])
const model = ref(context.value)
const loaded = ref(false)
const props = computed(() => context.node?.props || {})
const hasMessages = computed(() => Object.keys(context?.messages || {}).length > 0 )
const element = ref()  
const editor = ref()  
const config = ref({
  textIcons: false,
  iframe: false,
  iframeStyle: '*,.jodit_wysiwyg {color:red;}',
  height: 'auto',
  minHeight:400,
  maxHeight:600,
  // defaultMode: Jodit.MODE_WYSIWYG,
  imageDefaultWidth:'100%',
  observer: {
    timeout: 100
  },
  commandToHotkeys: {
    'openreplacedialog': 'ctrl+p'
  },
})

const changeInput = (content) => {
  // console.log("editor change", model.value)
  context.node.input(content)
}
  
onMounted(async () => {
  const {Jodit} = await import("jodit").then((mod) => mod) 

  config.value.defaultMode = Jodit.MODE_WYSIWYG
  editor.value = new Jodit(element.value, config.value)
  console.log(editor.value)
  editor.value.value = model.value
  editor.value.events.on('change', changeInput)

  loaded.value = true
})

onBeforeUnmount(() => {
  editor.value.destruct()
  model.value = ''
})
</script>
 