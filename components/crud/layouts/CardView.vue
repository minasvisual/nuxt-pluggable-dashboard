<template>
  <section class="card-view "> 
      <section class="row py-2">
        <div class="col-12 col-sm-7 d-flex ">
          <span v-if="selectedRow.length > 0" class="selectedActions">
            <label class="m-0">Selected: {{ selectedRow.length }} </label> 
            <CButton @click="bulkDelete">
                <CIcon name="cil-trash" />
            </CButton>
          </span>
          <CInputCheckbox label="All" type="checkbox" style="padding:0; margin:0;" inline  
                  @update:checked="selectionAll()"  /> 
          <CButton @click="fetchQueryInfo('pageChange', queryInfo)">
            <CIcon name="cil-reload" />
          </CButton>
          <CButton @click="onCreate">
            <CIcon name="cil-plus" />
          </CButton>


        </div>
        <div class="col-12 col-sm-5 d-flex justify-content-end align-items-center">
          
          <FormulateInput type="select" placeholder="Input search" v-model="search.input" 
                          :outer-class="['p-0 m-0']" style="width:120px !important;" :input-class="['px-1']"
                          :options="optionfyObject(fields, 'label','key')" /> 

          <FormulateInput v-model="search.value" placeholder="keywork search" :debounce="1000"
                          :outer-class="['p-0 m-0']" style="width:150px !important;" :input-class="['px-1']"
                          @input="fetchQueryInfo('filter', { [search.input]: search.value })">
            <template #help>
              <a class="input-suffix" v-if="search.value" @click="search.value = null"> 
                <CIcon name="cilXCircle" /> 
              </a>
            </template>
          </FormulateInput>  
          
          <span class="pl-2">Limit: </span>
          <CSelect :options="showPerPage" :value="perPage" class="m-0 ml-2"
                  @update:value="(num) => fetchQueryInfo('pageSize', num)" />
        </div>
      </section>
      <div class="row px-3">
        <CCol sm=6 lg=3 v-for="(item, idx) of grid" :key="idx" class="card-item"> 
           <section class="d-flex text-right">
              <CInputCheckbox type="checkbox" :checked="isSelected(item)" @update:checked="selectionChange(item)" />
              <div class="spacer w-100"></div>
              <CButton  class="card-header-action mr-3"  @click="onEdit(item)"> 
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton   class="card-header-action"  @click="onDelete(item)"> 
                <CIcon name="cil-trash" />
              </CButton>
            </section>
            <section v-for="cell of fields" :key="cell.key" :class="[cell.type]" >
              <b v-if="!['image'].includes(cell.type)">{{ cell.label }}: </b> 
              <CellTypes :cell="cell" :data="item" />
            </section> 
        </CCol>
        <CCol col=12 class="mt-5">
            <CPagination
              :activePage.sync="currentPage"
              :pages="calcPages(totals, perPage)"
              size='sm'
              align="center"
              @update:activePage="(qr) => fetchQueryInfo('page', qr)"
            />
        </CCol>    
      </div> 
  </section>
</template>

<script>  
import { mapState } from 'vuex'
import _ from 'lodash'
import { filterParams } from '../../../services/helpers'
import { getData } from "../../../services/models";

import TableMixin from '../../../services/table.mixin'
import CellTypes from './index' 

const { get, has, debounce, isEqual, filter } = _

export default {
  name:"CardView",
  mixins:[TableMixin],
  props:['schema','resource'],
  components:{
    CellTypes,
  },
  data () {
    return {
      currentPage: 1,
      perPage: 5,
      showPerPage: [8, 24, 60, 120], 
      queryInfo: { type: "init", page: 1 },
      data: {},
      details: [],
      selectedRow: [],
      collapseDuration: 0,
      search:{}
    }
  },
  computed:{ 
    titles(){
      return has(this.schema, 'properties') ? this.schemaColumns([ ...this.schema.properties ]) : []
    },
    grid(){
      return  get(this.resource, 'rows', [])
    },
    totals(){
      return get(this.resource, 'total', 0)
    },
    fields(){
      return this.titles.filter(i => !['selected','actions'].includes(i.key) )
    }
  },
  methods: {
    fetchData: debounce(async function(queryInfo){
      this.queryInfo = queryInfo
      this.$emit('fetchData', queryInfo)
    }
    // function(queryInfo){
    //   try{
    //     console.debug("table fetchData called", queryInfo, this.schema.api.rootApi)
        
    //     if( this.validateQueryInfo(queryInfo) ){
    //       this.queryInfo = queryInfo
    //       this.schema.api = filterParams(this.schema.api, { ...queryInfo, data: this.resource }) 
    //       //this.resetGrid()

    //       this.$store.commit('setLoader', ['table', true])
    //       this.data = await getData(this.schema, { ...queryInfo, data: this.resource })
    //       this.perPage = (this.data.rows && this.data.rows.length) || this.perPage
    //     }

    //     return true;
    //   }catch(err){
    //     console.log(err)
    //     this.$message(err.message, 'danger')
    //     return false;
    //   }finally{
    //     console.debug('Finally getData tbale')
    //     this.$store.commit('setLoader', ['table', false])
    //   }
    //}
    , 1000),
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
    getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: 'primary'
      }
    },
    toggleDetails (item) {
      this.$set(this.items[item.id], '_toggled', !item._toggled)
      this.collapseDuration = 300
      this.$nextTick(() => { this.collapseDuration = 0})
    },
    resetGrid(){
      this.data = { rows:[], total:0 }
      this.$store.commit('setLoader', ['table', false])
    },
  },
  async mounted(){
    this.data = { rows: get(this.resource, 'rows', []), total: get(this.resource, 'totals', 0) }
    
    //await this.fetchData(this.queryInfo)
    //this.$emit('fetchData', this.queryInfo)
  }
}
</script>

<style lang="scss">
.card-view{
  .card-item{
    overflow-y: auto;
    overflow-x: hidden;
    padding: 5px;
    border: 1px solid #ccc;
    height: 400px; 
      
    > section{
      padding: 3px 0px;
    }
    .image{
      padding: 0px!important;
      width: 100%;
      height: 200px;
      .b{
        display: none;
      }
        
      :first-child{
        display: block !important;
        width: 100% !important;
        height: 200px;
        background: #ccc;
        img{
          width: 100% !important;
          height: 100% !important;
        }
      }
    }
    .select{
      display: flex;
      align-items: center;
      .table-select{
        padding: 0px;
        margin: 0px;
        select{
          padding: 0  0 0 10px;
        }
      }
    }

  }
  .formulate-input{
    position: relative;
    .input-suffix{
        position: absolute;
        right: 8px;
        top: 6px;	
      cursor: pointer;
    }
  }
  ::-webkit-scrollbar {
      width: 5px;
  }
  
  /* Track */
  ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
      -webkit-border-radius: 10px;
      border-radius: 10px;
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px;
      border-radius: 10px; 
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    display: none;
  }
}
</style>