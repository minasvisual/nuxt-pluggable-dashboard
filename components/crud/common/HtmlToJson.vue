<template lang="">
  <section class="flex">
    <div id="page">
    </div>

    {{ model }}
  </section>
</template>

<script setup> 
const model = ref({})
onMounted(() => {
  let doc = [...document.getElementById('page').children]

  function getTagJson(tag){
    let children = [...tag.children].map(i => getTagJson(i))
    return {
      "$el": tag.tagName.toLowerCase(),
      "attrs": [...tag.attributes].reduce(
        (pv, i, k) => (pv = {...pv, [i.name]: i.value}),
        ({})
      ),
      children
    }
  }

  model.value = doc.map(i => getTagJson(i))
  console.log(
    model.value
  )
})
</script>