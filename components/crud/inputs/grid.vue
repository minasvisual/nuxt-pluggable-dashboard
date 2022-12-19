<template>
  <div :data-type="context.type" :class="[props.outerClass ?? '']">
    <CrudTable :resource="[]" :model="model" @selected="changed" />  
    <p>Selected: {{ selected.length }}</p>
  </div>
</template>

<script setup>
  import CrudTable from '../Table.vue' 

  const { context } = defineProps(['context']) 
  const props = computed(() => context.node?.props || {}) 
  const model = ref(context.model)
  const selected = ref([]) 
  
  function changed(rows) { 
    selected.value = rows
    context.node.input(rows)
  }
</script>