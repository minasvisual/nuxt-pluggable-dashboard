<template>
  <div>
    <CrudTable :resource="[]" :model="model" @selected="changed" />  
    <p>Selected: {{ selected.length }}</p>
  </div>
</template>

<script setup>
  import CrudTable from '../Table.vue'
  import { schemaColumns } from '../../../libs/core/helpers'

  const { context } = defineProps(['context']) 
  const props = computed(() => context.node?.props || {}) 
  const model = ref(context.model)
  const selected = ref([]) 
 
  // function filterSelected (rows){
  //   return rows.filter(row)
  // }
  function changed(rows) {
    console.log("choosed", rows)
    selected.value = rows
    context.node.input(rows)
  }
</script>