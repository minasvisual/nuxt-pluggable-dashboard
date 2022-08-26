<template>
<div class="flex justify-center">
  <nav aria-label="Page navigation example">
    <ul class="flex list-style-none">

      <li class="page-item" v-if="hasPrev">
        <a class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 focus:shadow-none cursor-pointer"
          aria-label="Previous" @click.prevent="prev">
          <span aria-hidden="true">
            <ChevronLeftIcon class="h-6 w-6" aria-hidden="true" />
          </span>
        </a>
      </li> 
      <li class="page-item" :class="{ 'active': _actual === i }" v-for="i in pageNums" :key="i">
        <a class="page-link relative block py-1.5 px-3 rounded border-0  outline-none transition-all duration-300 rounded hover:text-gray-800 hover:bg-gray-200 focus:shadow-none cursor-pointer"
          :class="{ 'bg-blue-600 text-white ': _actual === i, 'bg-transparent text-teal-900': _actual != i }"
          @click.prevent="() => change(i)" >{{ i }}</a>
      </li>
      
      <li class="page-item" v-if="hasNext" >
        <a class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none cursor-pointer"
          aria-label="Next" @click.prevent="next">
          <span aria-hidden="true" class="text-md">
             <ChevronRightIcon class="h-6 w-6" aria-hidden="true" />
          </span>
        </a>
      </li>
    </ul>
  </nav>
</div>
</template>

<script>
  import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/outline'
  import _ from 'lodash'

  export default { 
    components: {  ChevronRightIcon, ChevronLeftIcon },
    props:{
      pages: {
        type: Number
      },
      actual: {
        type: Number,
        default: 1
      },
    },
    setup(props, { emit }){
      
      const _actual = ref(props.actual)   
      const _pages = ref(props.pages)   

      watch(_pages, (nil) => {
        console.log('novo pages', nil)
      })

      let hasPrev = computed(() => _actual.value > 1)
      let hasNext = computed(() => _actual.value < _pages.value)
      let pageNums = computed(() => {
        let init =  _pages.value > 5 
        let ends =  _pages.value > 10 
        let pg = init && ends && _actual.value > 5 && _actual.value < (_pages.value - 5) ? [_actual.value]:[] 
        return [ ..._.range(1, ( init ? 5:_pages.value)), ...pg, ..._.range( (ends ? (_pages.value - 5):_pages.value), _pages.value)] 
      })
      
      const prev = () => {
        _actual.value = _actual.value > 1 ? (_actual.value - 1) : _actual.value 
        console.log(
          'prev', typeof _actual.value , 1
        )
        emit('change', _actual.value)
      }

      const next = () => { 
        console.log(
          'next', _actual.value , _pages.value
        )
        _actual.value = _actual.value < _pages.value ? (_actual.value + 1) : _actual.value 
      
        emit('change', _actual.value)
      }

      const change = (num) => {
        _actual.value = num
        emit('change', _actual.value)
      }
           
      return {
        change,
        next,
        prev,
        hasPrev,
        hasNext,
        _,
        _actual,
        _pages,
        pageNums
      }
    },
    mounted(){
      this.$watch('pages', () => {
        this._pages = (this.pages + 1)
      }, { immediate: true })
    }
  }


</script>