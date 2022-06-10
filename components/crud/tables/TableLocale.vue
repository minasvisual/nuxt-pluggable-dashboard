<template>
  <section v-if="renderComponent">
    <CDataTable
      :items="data.rows"
      :fields="titles"
      column-filter
      :items-per-page="perPage"
      :addTableClasses="gete(schema, 'tableClasses', undefined)"
      :pagination="paginationData"
      hover
      sorter
      size="sm"
    >

      <template #over-table >
        <section class="row py-2">
          <div class="col-7 d-flex ">
            <span v-if="selectedRow.length > 0" class="selectedActions">
              <label class="m-0">Selected: {{ selectedRow.length }} </label> 
              <CButton @click="bulkDelete">
                  <CIcon name="cil-trash" />
              </CButton>
            </span>
            <CButton @click="forceReload">
              <CIcon name="cil-reload" />
            </CButton>
            <CButton @click="onCreate" v-if="can(schema, 'canCreate')">
              <CIcon name="cil-plus" />
            </CButton>
          </div> 
          <div class="col-5 d-flex justify-content-end align-items-center">
            <span>Limit: </span>
            <CSelect :options="showPerPage" class="m-0 ml-2" :value.sync="perPage" />
          </div>
        </section>
      </template>

      <template #selected-header> 
        <CInputCheckbox type="checkbox" inline @update:checked="selectionAll()" style="padding:0; margin:0;" />
      </template>
      
      <template v-for="cell of titles" #[cell.key]="{item, index}">
        <td :class="['td-'+cell.key]">
          <CellTypes :cell="cell" :data="item" />
        </td>
      </template>

      <template #selected="{item}">
        <td :class="['td-selection']">
           <CInputCheckbox type="checkbox" :checked="isSelected(item)" @update:checked="selectionChange(item)" />
        </td>
      </template>

      <template #actions="{item, index}">
        <td :class="['td-actions']">
            <section class="d-flex text-right">
              <CButton  class="card-header-action mr-3"  @click="onEdit(item)" v-if="can(schema, 'canEdit')"> 
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton   class="card-header-action"  @click="onDelete(item)" v-if="can(schema, 'canDelete')"> 
                <CIcon name="cil-trash" />
              </CButton>
            </section>
        </td>
      </template>
      
      <template #no-items-view>
        <h6 class="text-center">No data found</h6>
      </template>

      <template #loading>
        <div class="text-center"><CSpinner color="info"/></div>
      </template>

    </CDataTable>
  </section>
</template>

<script>  
import { get, has, debounce, isEqual, filter } from 'lodash'

import TableMixin from '../../../services/table.mixin'
import CellTypes from './index'

export default {
  name:"TableLocale",
  mixins:[TableMixin],
  props:{
    schema: {
      type:Object,
      default: {}
    },
    resource:{
      type: [Array, Object, String],
      default: () => []
    }
  },
  components:{
    CellTypes
  },
  data () {
    return {
      currentPage: 1,
      perPage: 5,
      showPerPage: [5, 15, 25, 50, 100], 
      details: [],
      selectedRow: [],
      collapseDuration: 0,
      paginationData: { align: 'center', size: 'sm' },
      renderComponent: false
    }
  },
  computed:{
    titles(){
      return has(this.schema, 'properties') ? this.schemaColumns([ ...this.schema.properties ]) : []
    },
    data(){
      return { rows: (this.resource || []), total: (  Array.isArray(this.resource) ? this.resource.length : 0 ) }
    },
  },
  methods: {
    resetGrid(){
      this.data = { rows:[], total:0 }
      this.loading = true
    },
    onCreate() { 
      this.$emit('actions:create', {})
    },
    onEdit(row){
      this.$emit('actions:edit', row)
    },
    onDelete(row){
      if( confirm('Are you sure to delete?') ) 
          this.$emit('actions:delete', row)
    }, 
    async bulkDelete() {
      if( confirm(`Are you sure to delete ${this.selectedRow.length} rows?`) ){
          this.$emit('actions:deleteBatch', this.selectedRow)
      }
    },
    forceReload(){
      console.debug('reloading')
      this.renderComponent = false;
      this.$nextTick(() => {
        this.renderComponent = true
      })
    },
    toggleDetails (item) {
      this.$set(this.items[item.id], '_toggled', !item._toggled)
      this.collapseDuration = 300
      this.$nextTick(() => { this.collapseDuration = 0})
    },
    logger(v){
      console.log('change ', v)
    },
    gete: get
  },
  mounted(){
      if( !this.schema.pagination ) this.paginationData = false
      
      this.renderComponent = true
  }
}
</script>