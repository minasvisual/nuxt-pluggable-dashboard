<template> 
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
           <tr class="pd-toolbar">
                <th scope="col" :colspan="totalCols" class="py-2">
                  <button class="px-4" type="button" v-if="selected.length" @click="deleteSelected">Delete {{ selected.length }} Selected</button>
                  <button class="px-4" type="button" @click="getDatasource">Refresh</button>
                  <button class="px-4" type="button" @click="() => emit('new', {target: 'new', row: {}})">New</button>
                </th>
            </tr>
            <tr>
                <th> </th>
                <th scope="col" class="px-2 py-1" v-for="col in schema" :key="col.key" @click="() => toggleSort(col)"> 
                  {{ col.label }} <span v-if="col.sorter && config.sort == col.key">{{ col._order ? 'Up': 'Down'}}</span>
                </th> 
            </tr>
            <tr class="pd-filters">
                <th class="px-6 py-4">
                  <input type="checkbox" :checked="selected.length == table.length " @change="selectAll" /> All
                </th>
                <th scope="col" class="px-2 py-1" v-for="col in schema" :key="col.key">
                  <FormKit v-if="col.filter" outer-class="m-0 p-0" :type="_.get(col, 'filter.type', 'search')" v-model="filters[col.key]" :delay="500" @input="changeFilters"/>
                </th>
                <th class="px-6 py-4 flex items-center justify-end">
                  Limit <FormKit outer-class="m-0 p-0 pl-2" type="select" v-model="perPage" :options="[5,15,25,50,100,500]" @input="changeLimit" />
                </th>
            </tr>
        </thead> 
        <tbody>
            <tr class="pd-rows bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="(row, index) in table" :key="index"> 
                <td class="px-6 py-4" >
                    <input type="checkbox" :value="false" :checked="isSelected(selected, row)" @change="selectionChange(selected, row)" />
                </td> 
                <td class="px-6 py-4" v-for="col in schema" :key="col.key">
                  <CrudTables :cell="col" :data="row" /> 
                </td> 
                <td class="px-6 py-4 flex justify-end" >
                  <a class="cursor-pointer mr-3" @click="() => emit('edit', { target: 'edit', row})" v-if="can(schema, 'canEdit')">Edit</a>
                  <a class="cursor-pointer" @click="() => deleteEmit(row)" v-if="can(schema, 'canDelete')">Delete</a>
                </td> 
            </tr> 
        </tbody>
        <tfoot>
          <tr class="pd-footer">
            <td :colspan="totalCols" class="w-full text-center p-2 pt-4">
              <CrudCommonPagination :pages="totalPages" :actual="1" @change="changePage" />
            </td>
          </tr>
        </tfoot>
    </table>
 
  </div>
</template>



<script setup>
  import _ from 'lodash' 
  import { schemaColumns, can, isSelected, selectionChange, selectionAll, fetchQueryInfo, filterParams, validateQueryInfo, calcPages } from '~/libs/core/helpers' 
  import ResourceClass from '~/libs/core/resource'

  let { resource } = defineProps({ 
    // {
    //   model: {
    //     type: Object,
    //     default: () => ({ properties: [] })
    //   }
    // },
    resource: {
      type: Array,
      default: []
    }
  })

  let { $axios } = useNuxtApp() 
  let Instance = ResourceClass({ $axios })
  let route = useRoute() 
  let filters = ref({})
  let selected = ref([])
  let table = ref(resource)
  let perPage = ref(5)
  let tableCount = ref(1)
  let model = inject('model') 
  let config = reactive({})
  let queryInfo = reactive({})

  const emit = defineEmits(['edit','delete'])
    
  let schema = computed(() => { 
    return schemaColumns(model.value.properties) 
  })
    
  let totalCols = computed(() => { 
    return schema.value.length + 2
  })
    
  let totalPages = computed(() => { 
    return calcPages(tableCount.value, perPage.value)
  })

  const deleteEmit = (row) =>{
    if( confirm('Are you sure?') ) 
     emit('delete', { target: 'delete', row})
    else
     return false
  }

  const selectAll = () => {
    selected.value = selectionAll(selected.value, table.value)
    table.value = [ ...table.value ]
  }

  const deleteSelected = () => {
    if( confirm('Are you sure?') ) 
      for( let row of selected.value ){
        emit('delete', { target: 'delete', row})
      }
  }

  const toggleSort = (col = {}) => {
    nextTick(() => { 
      config.sort = col.key
      col._order = _.isNil(col._order) ? false : !col._order

      queryInfo = { ...queryInfo, ...fetchQueryInfo('sort', { column: col.key, asc: col._order }) }

      getDatasource()
    })
  }

  const changePage = (num) => {
    nextTick(() => { 
      queryInfo = { ...queryInfo, ...fetchQueryInfo('page', num) }

      getDatasource()
    })
  }

  const changeLimit = (v) => {
    nextTick(() => { 
      queryInfo = { ...queryInfo, ...fetchQueryInfo('pageSize', v) }

      getDatasource()
    })
  }

  const changeFilters = () => {
    nextTick(() => { 
      queryInfo = { ...queryInfo, ...fetchQueryInfo('filter', filters.value) }

      getDatasource()
    })
  }

  const getDatasource = async (data={}, config={}) => {
    try {
      console.debug("chamou to getDatasource", queryInfo)
      //this.resetGrid() 
      if(!validateQueryInfo( JSON.parse(JSON.stringify(queryInfo)) )) return;

      let api = filterParams({ ...model.value.api }, { ...queryInfo, data: resource.value }) 

      Instance.setModel({ ...model.value, api })

      let { rows, total } = await Instance.getData(data, config)
      
      table.value = rows
      tableCount.value = total
    } catch (error) {
      alert("Error to getData")
    }
  }

  // watch([schema], () => {
  //   Instance.setModel({ ...model.value })

  //   getDatasource()
  // })
    
  onMounted(async () => {
    try { 
      // console.error("table mounted", model.value)
      Instance.setModel({ ...model.value })

      await getDatasource()
    } catch (error) {
      console.error("onmounted", error)
    }
  })

  
  onUnmounted(() => {
      // console.error("table unmountedmounted", model.value)
      Instance.setModel({ })
  })
</script>
