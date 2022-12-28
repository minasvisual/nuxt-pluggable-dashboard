<template>
    <span v-html="expression" v-on="$listeners"></span >
</template>

<script>
import { interpolate } from '~/libs/core/helpers'
import _ from 'lodash'
const { get } = _
export default {
    props:['data', 'cell', 'row'],
    computed:{ 
        expression(){ 
            return interpolate( get(this.cell, 'action.template', '{data}'), {data: this.data, cell: this.cell, row: this.row} ) 
        }
    }
}
</script>