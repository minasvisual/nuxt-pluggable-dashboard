<template>
  <div :data-type="context.type" :class="[props.outerClass ?? '']">
    <div class="flex flex-col py-2">
      <CrudTable :resource="[]" :model="model" @selected="changed" />  
      <p class="py-2">Selected: {{ selected.length }}</p>
    </div>
    <hr />
  </div>
</template>

<script setup>
  import CrudTable from '../Table.vue' 

  const { context } = defineProps(['context']) 
  const props = computed(() => context.node?.props || {})  
  const model = ref(props.value?.model) 
  const selected = ref([]) 
  
  function changed(rows) { 
    selected.value = rows
    context.node.input(rows)
  }
</script>