<template> 
  <div class="flex items-center cursor-pointer py-2" :class="['cursor-not-allowed']">
    <span class="font-semibold text-xs mr-1" v-if="!model">
        Off
    </span>
    <div class="rounded-full w-10 h-6 p-0.5 bg-gray-300" :class="{'bg-red-500': !model,'bg-green-500': model}">
        <div class="rounded-full w-5 h-5 bg-white transform mx-auto duration-300 ease-in-out" :class="{'-translate-x-2': !model,'translate-x-2': model}"></div>
    </div>
    <span class="font-semibold text-xs ml-1" v-if="model">
        On
    </span>
  </div>  
</template>
 
<script setup> 
  const { data, cell, row } = defineProps(['data', 'cell', 'row'])  
  const model = ref(row ?? false)
</script> 