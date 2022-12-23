<template>
  <NuxtLayout class="content" name="logged" >
    <div class="w-full md:w-1/2 mx-auto mt-4">
      <p>Home</p>  
       
      <span class="flex gap-1"><b>1</b><b>2</b></span>
      <span class="flex gap-2"><b>1</b><b>2</b></span>
      <span class="flex gap-3"><b>1</b><b>2</b></span>
      <span class="flex gap-4"><b>1</b><b>2</b></span>
      <span class="flex gap-5"><b>1</b><b>2</b></span>

    </div>
  </NuxtLayout>
</template>

<script setup>
import Cities from '@/public/models/cities.json' 
import { multiple } from '@/components/crud/inputs/multiple';
import { number } from '@formkit/inputs';
const data = ref([3271])
const overwrite = {
  properties:[{name:'id'},{name:'city', config:{grid:true}}],
  api:{ 
    "rootApi": "https://api.mantovaniarts.com/nightfy/events",
    "wrapData": "rows",
    "totalData": "count", 
    fieldValue: 'id',
    fieldLabel: 'city',
    "pagination": {
      "pageField": "page",
      "limitField": "limit",
    },
    "params":{
      "limit": 15,
      "sort": "-id",
      "filter": 'city,ne,'
    }
  }
}
const groupValues = ref({})
const options = [
  { value: 1, label: 'select'},
  { value: 2, label: 'select 2'},
]
const masks = { 
  mask: 'R$ num{.}`cents',
  blocks: {
    num: {
      mask: Number,
      signed: true,
      scale: 0,
      overwrite: true
    },
    cents: {
      mask: '`0`0',
      normalizeZeros: true,
      padFractionalZeros: true,
      overwrite: true
    }
  }
}
</script>

<style>
.formkit-addend {
  border: 0;
  background-color: #efefef;
  margin: 0 0.25em;
  width: 4em;
  padding: 0.5em;
}
.formkit-addend:first-child {
  margin-left: 0;
  border-radius: 0.25em 0 0 0.25em;
}
.formkit-addend:focus {
  outline: 0;
} 
.formkit-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 15em;
  background-color: white;
  box-shadow: 0 0 0.5em rgba(0 0 0 / 10%);
  margin: 0;
  padding: 0;
  list-style-type: none;
  overflow: hidden;
  border-radius: 0.25em;
}
.formkit-dropdown-item {
  padding: 0.5em;
  border-bottom: 1px solid #e4e4e4;
}
.formkit-dropdown-item[data-selected='true'] {
  background-color: #cfe8fc;
}
.formkit-value {
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 0.25em;
  box-sizing: border-box;
  color: black;
  display: flex;
  justify-content: space-between;
  padding: 0.55em 0.5em;
  text-decoration: none;
  width: 100%;
}
.formkit-value::after {
  content: '\00D7';
  margin-left: 0.5em;
  font-size: 1.1em;
}
</style>