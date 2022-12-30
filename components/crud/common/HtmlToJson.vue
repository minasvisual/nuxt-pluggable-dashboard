<template lang="">
  <section class="flex gap-4">
    <pre  id="htmlPage" class="page w-3/4 border" contenteditable="true" @input="convert">
    </pre>
    <div class="w-1/4">
      <JsonEditor  
        mode="tree"
        :value="model"
        :queryLanguagesIds="['javascript']"  
      />
    </div> 
  </section>
</template>

<script setup> 
const model = ref([])
const ignore = ['svg','script','!--']

function getTagJson(tag){  
  let children = []
  let childs = [...tag.children]
  
  childs.forEach(i => {
    if( !ignore.includes(i.tagName?.toLowerCase()) )
      children.push(getTagJson(i))
  })

  return {
    "$el": tag.tagName.toLowerCase(),
    "attrs": [...tag.attributes].reduce(
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
  model.value = []
  let base = stringToHTML(input?.target?.innerText)
  let doc = [...base.children]
 
  doc.forEach(i => {
    if( !ignore.includes(i.tagName?.toLowerCase()) )
      model.value.push(getTagJson(i))
  })
  console.log(base)
}

onMounted(() => {
})
</script>