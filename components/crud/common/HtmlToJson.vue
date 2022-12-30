<template lang="">
  <section class="flex gap-4">
    <pre  id="htmlPage" class="page w-3/4 border" contenteditable="true" @input="convert">
    </pre>
    <div class="w-1/4">
      <JsonEditor  
        mode="tree"
        v-model:text="model" 
      />
    </div> 
  </section>
</template>

<script setup> 
const model = ref('[]')
const ignore = ['script','!--','#comment']

function checkTextValue (node) {
  let nodeName = node?.nodeName?.toLowerCase()
  let nodeValue = node?.nodeValue?.trim().replace('\\n', '')
  if( ignore.includes(nodeName) ) return false
  if( nodeName == '#text' && !nodeValue ) return false
  return true
}

function getTagJson(tag){  
  let children = []
  let childs = [...tag.childNodes]
  let tagName = tag?.nodeName?.toLowerCase()
 
  if( childs.length > 0  ){ 
    childs.forEach(i => { 
      if( checkTextValue(i) ) children.push(getTagJson(i))
    })    
  } 

  if( tagName == '#text' )
    return tag.nodeValue

  return {
    "$el": tagName,
    "attrs": [...(tag.attributes ?? [])].reduce(
      (pv, i, k) => (pv = {...pv, [i.name]: i.value}),
      ({})
    ),
    children
  }
}

var stringToHTML = function (str) {
	var dom = document.createElement('div');
	dom.innerHTML = str;
	return dom;
}

function convert (input) {   
  let childs = []
  let base = stringToHTML(input?.target?.innerText)
  let doc = [...base.childNodes]
 
  childs = doc.filter(i => checkTextValue(i)).map(i => getTagJson(i))
  // console.log(childs)
  model.value = JSON.stringify(childs)
  // console.log(model.value)
}

onMounted(() => {
})
</script>