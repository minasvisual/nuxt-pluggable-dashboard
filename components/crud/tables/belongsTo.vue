<template>
    <span v-if="renderComponent">{{ item[ cell.action.fieldLabel ] }}</span>
    <span v-else><CSpinner color="info" size="sm" /></span>
</template>


<script>
import { get } from 'lodash'
import { mergeDeep } from '../../../services/helpers'
import { getData } from '../../../services/models'
import InputMixin from '../../../services/input.mixin'

export default {
  props:['data', 'cell'],
  mixins: [InputMixin],
  data(){return{ 
    item: {},
    schema: {}
  }},  
  watch:{
    async data(newVal){
      if( newVal )
        await this.buildData()
    }
  },
  async mounted(){
    this.renderComponent = false
  
    let { schema } = this.cell

    if( schema )
      this.schema = await this.loadNestedSchema(schema)
        
    await this.buildData()

    this.renderComponent = true
  },
  methods:{  
    async buildData(){   
      this.item = {}
      let { action } = this.cell

      if( action && action.fieldValue )
        this.schema = { api: mergeDeep(this.convertAttributesToSchema(action), (this.schema.api || {})) }

      if( this.schema && this.schema.api && this.data ){
        let pk = get(this.schema, 'primaryKey', 'id')
        this.item = await getData( this.schema, { [pk]: this.data }) 
      }else{
        this.item = {}
      }
    },
    forceRerender() {
      this.renderComponent = false;

      this.$nextTick(() => {
        this.renderComponent = true;
      });
    }, 
  }
}
</script>

<style lang="css">
  .table-select select{
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: '';
    border: none  !important;
    background-color: transparent !important;
  }
</style>