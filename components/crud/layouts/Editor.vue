<template>
  <div v-if="value" v-html="value"></div>
</template>

<script setup>
  const { value = '' } = defineProps(['value'])
</script>