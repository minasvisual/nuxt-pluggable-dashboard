<template>
  <div class="alert" v-if="msg"> 
    <a class="btn-close cursor-pointer rounded-full bg-white" @click="close">X</a>
    <div class="" v-html="msg"></div> 
    <div class="progress bg-gray-200 rounded-full h-1.5 dark:bg-gray-700" v-if="time">
      <div class="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500" :style="{ width: `${perc}%` }"></div>
    </div>
  </div>
</template>

<script setup>
  const { msg, close, expire=3000 } = defineProps(['msg','close','expire'])
  const delay = () => new Promise( res => setTimeout(res, 100))
  let loader = ref(expire)
  let perc = computed(() => (loader.value * 100) / expire)
  let timed = computed(() =>  expire !== false)

  onMounted(async () => {
    if( timed ){
      while( loader.value > 0 ){
        await delay()
        loader.value = loader.value - 100
      }
      close()
    }
  })
</script>

<style lang="scss">
.alert-wrap{
  background: rgba(0,0,0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .alert{
      padding: 10px;
      border-radius: 10px;
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      min-width: 200px; 
      background-color: white; 
  }
  .btn-close{
    position: absolute;
    right: -10px;
    top: -10px;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .progress{
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
  }
}
</style>