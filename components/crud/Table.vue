<template> 
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3" v-for="col in schema" :key="col.key">{{ col.label }}</th> 
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="(row, index) in resource" :key="index"> 
                <td class="px-6 py-4" v-for="col in schema" :key="col.key">{{ row[col.key] }}</td> 
                <td class="px-6 py-4" >
                  <a class="cursor-pointer mr-3" @click="() => emit('edit', { target: 'edit', row})">Edit</a>
                  <a class="cursor-pointer" @click="() => deleteEmit(row)">Delete</a>
                </td> 
            </tr> 
        </tbody>
    </table>
  </div>
</template>



<script setup>
  import _ from 'lodash' 
  import {schemaColumns} from '~/libs/core/helpers'

  const emit = defineEmits(['edit','delete'])
    
  const { model, resource } = defineProps({
    model: {
      type: Object,
      default: () => ({ properties: [] })
    },
    resource: {
      type: Array,
      default: []
    }
  })

  const deleteEmit = (row) =>{
    if( confirm('Are you sure?') ) 
     emit('delete', { target: 'delete', row})
    else
     return false
  }

  let schema = computed(() => {
    return schemaColumns(model.properties) 
  })
</script>
