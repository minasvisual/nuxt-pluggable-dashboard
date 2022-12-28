<template>
    <a class="p-1" v-if="inputType == 'link'" href="#" @click.prevent="emitClick">
        {{ replaceContent() }}
    </a>
    <CButton 
        v-else-if="inputType == 'button'"
        size="sm"
        color="info"
        v-on:click="emitClick" 
        v-bind="{ ...cell, type: inputType }"
    >   
        {{ replaceContent() }}
    </CButton>
     <FormulateInput 
        v-else
        input-class="p-1"
        :placeholder="( inputType == 'select' ? 'select..':'empty' )"
        @blur-context="emitClick"
        v-model="data"
        v-bind="{ ...cell, type: inputType, name: cell.key, label: false }"
    />
</template>
<script>
import _ from 'lodash'
import { interpolate,  } from '~/libs/core/helpers'
const { get, mergeDeep } = _
export default {
    props:['data', 'cell', 'row'],
    computed:{
        inputType(){
            return get(this.cell, 'action.type', 'button')
        },
        sendType(){
            if( this.cell?.action?.source == 'cell')
                return this.cell
            else if( this.cell?.action?.source == 'row')
                return { ...this.row, [this.cell.key]: this.data }
            else if( this.cell?.action?.source == 'field')
                return { [this.cell.key]: this.data }
            else if( this.cell?.action?.source == 'context')
                return mergeDeep(this.cell?.action?.data, { overwrite: {api:{ resource:this.row }}, row: get(this.row, this.cell?.action?.id, this.data) })
            else if( this.cell?.action?.source == 'custom')
                return this.cell?.action?.data
            else    
                return this.data
        }
    },
    methods: {
        replaceContent() {
            if( !['button','link'].includes(this.inputType) )
                return false

            if( this.cell?.action?.label ) 
                return interpolate(this.cell.action.label, {data: this.data, action: this.cell.action, row: this.row  }).toString()
            else
                return this.data && this.data.toString()
        },
        emitClick(){
            if( !this.cell?.action?.handler || (!['custom','context'].includes(this.cell?.action?.source) && this.data == this.row[this.cell.key]) ) return;

            this.row[this.cell.key] = this.data
            this.$bus.$emit(this.cell?.action?.handler, this.sendType)
            console.debug("table/Actions emitclick called", this.cell?.action?.handler, this.sendType)
        }
    }
}
</script>

<style scoped>
    select{
        padding: 3px !important;
    }
</style>
