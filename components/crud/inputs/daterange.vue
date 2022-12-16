<template>
  <div class="formkit-outer" :data-type="context.type" :class="[props.outerClass ?? '']">
    <span class="formkit-label" :class="[props.labelClass ?? '']" v-if="context.label">
      {{ context.label }}
    </span> 
    <div class="formkit-wrapper flex items-center cursor-pointer cm-toggle-wrapper"  
          @click="setValue" :class="[props.wrapperClass ?? '']">
      <label class="formkit-inner w-full rounded-sm" >
        <input class="border-0 w-full" placeholder='0000-00-00' type="text" ref="init" v-model='model.init' maxlength="10" @input="setValue" /> 
        <input class="border-0 w-full" placeholder='0000-00-00' type="text" ref="end"  v-model='model.end'  maxlength="10" @input="setValue" />
      </label>
      </div>  
    <span class="formkit-help" :class="[props.helpClass ?? '']" v-if="context.help">
      {{ context.help }}
    </span>
    <ul class="formkit-messages" v-if="hasMessages"> 
      <li class="formkit-message" v-for="msg of context.messages" :key="msg.key">
        {{ msg.value }}
      </li>
    </ul>
    {{ model }}
  </div>
</template>
 
<script setup> 
  import IMask from 'imask';
  const { context } = defineProps(['context']) 
  const props = computed(() => context.node?.props || {})
  const model = ref({})
  const init = ref(null)
  const end = ref(null)
  const mask = {
    mask: Date,  // enable date mask 
    // other options are optional
    pattern: 'Y-`m-`d',  // Pattern mask with defined blocks, default is 'd{.}`m{.}`Y'
    // you can provide your own blocks definitions, default blocks for date mask are:
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2,
      },
      m: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
      },
      Y: {
        mask: IMask.MaskedRange,
        from: 1900,
        to: 9999,
        maxLength: 4,
      }
    },
    // define date -> str convertion
    format: function (date) {
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      
      if (day < 10) day = String(day).padStart(2,'0')
      if (month < 10) month = String(month).padStart(2,'0')
      
      return [year, month, day].join('-');
    },
    // define str -> date convertion
    parse: function (str) {
      var yearMonthDay = str.split('-'); 
      return new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]);
    }, 
    dispatch: function (appended, dynamicMasked) {
      // var number = (dynamicMasked.value + appended).replace(/\D/g,'');

      // return dynamicMasked.compiledMasks.find(function (m) {
      //   return number.indexOf(m.startsWith) === 0;
      // });

      console.log('dispatch', appended, dynamicMasked)
      return dynamicMasked
    },
    // optional interval options  
    autofix: true,  // defaults to `false`, see details
    // also Pattern options can be set
    lazy: true,
    // and other common options
    overwrite: true  // defaults to `false`
  }
  
  function setValue () { 
    context.node.input(model.value)
  } 
  
  onMounted(() => {
    var dateInitMask = IMask(init.value, mask)
    var dateEndMask = IMask(end.value, mask)
  })
</script> 