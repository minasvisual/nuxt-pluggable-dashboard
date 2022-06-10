<template>
<div class="flex justify-center">
  <nav aria-label="Page navigation example">
    <ul class="flex list-style-none">

      <li class="page-item" v-if="hasPrev">
        <a class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 focus:shadow-none cursor-pointer"
          aria-label="Previous" @click.prevent="prev">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item" :class="{ 'active': _actual === i }" v-for="i in _.range(1, pages+1)" :key="i">
        <a class="page-link relative block py-1.5 px-3 rounded border-0  outline-none transition-all duration-300 rounded hover:text-gray-800 hover:bg-gray-200 focus:shadow-none cursor-pointer"
          :class="{ 'bg-blue-600 text-white ': _actual === i, 'bg-transparent text-teal-900': _actual != i }"
          @click.prevent="() => change(i)" >{{ i }}</a>
      </li>
      
      <li class="page-item" v-if="hasNext" >
        <a class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none cursor-pointer"
          aria-label="Next" @click.prevent="next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</div>
</template>

<script setup>
  import _ from 'lodash'
  const emit = defineEmits(['change'])

  const { pages, actual } = defineProps({
    pages: {
      type: Number,
      default: 1
    },
    actual: {
      type: Number,
      default: 1
    },
  })
  
  const _actual = ref(actual) 

  watch(['pages'], ([pg]) => {
    console.log('pages mudou', pg)
  })

  let hasPrev = computed(() => _actual.value > 1)
  let hasNext = computed(() => _actual.value < pages)
  
  const prev = () => {
    _actual.value = _actual.value > 1 ? (_actual.value - 1) : _actual.value 
    console.log(
      'prev', typeof _actual.value , 1
    )
    emit('change', _actual.value)
  }

  const next = () => {
    _actual.value = _actual.value < pages ? (_actual.value + 1) : _actual.value 
    console.log(
      'next', typeof _actual.value , typeof pages
    )
    emit('change', _actual.value)
  }

  const change = (num) => {
    _actual.value = num
    emit('change', _actual.value)
  }

  onMounted( () => {
    console.log( 
      _actual.value,
      pages
    )
  })
</script>