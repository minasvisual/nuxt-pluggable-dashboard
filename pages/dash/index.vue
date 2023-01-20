<template>
  <NuxtLayout class="content" name="logged" >
    <div class="content m-1 md:mx-12">
      <h1 class="text-lg py-2">Home</h1>  
    </div>
  </NuxtLayout>
</template>

<script setup> 
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