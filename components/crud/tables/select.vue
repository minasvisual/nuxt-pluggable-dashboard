<template>
    <select 
        class="table-select"
        v-if="renderComponent"
        v-model="data"
        size="sm" 
    >
        <!-- v-on="$listeners" -->
      <option v-for="(opt, idx) in (cell.options || options)" :key="idx" :value="opt.value">{{ opt.label }}</option>
    </select>
</template>


<script> 
import { filterParams, mergeDeep } from '~/libs/core/helpers'
import InputMixin from '~/libs/core/input.mixin'

export default {
  props:['data', 'cell'],
  mixins: [InputMixin],
  data(){return{ 
  }},
  computed:{

  },
  async mounted(){
    let { action, schema } = this.cell

    if( schema )
      schema = await this.loadNestedSchema(schema)
      
    // if( action && action.fieldValue )
    //   schema = { api:  }

    if( schema && schema.api  )
      this.cell.options = await this.getOptions(
          { ...schema.api, ...action }, 
          this.data, 
          filterParams(schema.api, { filters:[{prop: action.fieldValue, value: this.data}] }) 
      )

    this.renderComponent = true
  },
  methods:{ 
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