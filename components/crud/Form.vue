<template>
  <div class="form">
    <FormKitSchema
      v-if="schema"
      :schema="schema"
      :data="{
        id:1,
        title:'HTML Tutorials For Beginners',
        cover:'https://i.ytimg.com/vi/Y1BlT4_c_SU/sddefault.jpg',
        tags:'HTML|Beginners',
        url:'PL4cUxeGkcC9ibZ2TSBaGGNrgh4ZgYE6Cc',
        channel:'The Net Ninja',
        channel_url:'UCW5YeuERMmlnqo4oq8vwUpg',
        lang:'EN',
        created_at:'2021-12-17T23:12:53.000Z'
      }"
    />
    <div v-else>
      schema nao encontrado
    </div>
  </div>
</template>



<script setup>
  import _ from 'lodash'
  import { FormKitSchema } from '@formkit/vue'

  const { model, data } = defineProps({
    model: {
      type: Object,
      default: () => ({ properties: [] })
    }, 
    data: {
      type: Object,
      default: () => ({})
    }, 
  })

  let schema = computed(() => {
    return model.properties.map((row) => {
      return {
        ...row,
        $formkit: _.get(row, 'type', 'text')
      }
    })
  })


</script>
