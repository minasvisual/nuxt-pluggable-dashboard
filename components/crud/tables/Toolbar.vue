<template>
    <section class="d-flex" v-if="schema">
        <slot />
        <span v-for="(act, i) of customActions" :key="i">
            <button class="btn btn-link" v-on:click="run(act)">
                <CIcon v-if="act.icon" :name="act.icon" />
                <span v-else v-html="act.label"></span>
            </button>
        </span>

        <slot name="append" />
    </section>
</template>

<script>
import { get } from 'lodash'
import ActionsMixin from '../../../services/actions.mixin'

export default {
    mixins: [ActionsMixin],
    props:{
         schema: Object,
         data: {
             type: Object,
             default: () => ({})
         },
         target:{
             type: String,
             default: 'toolbar'
         },
    },
    computed:{
        customActions(){
            return get(this.schema, 'toolbar', []).filter(i => (!i.target && this.target == 'toolbar') || i.target == this.target )
        }
    },
    methods:{
        run(action){
            console.log(action, this.data, this.data[(action.id || 'id')])
            if(action.handler)
                this.$bus.$emit( action.handler, this.sendType({ action }, {...this.data}, this.data[(action.id || 'id')])  );
        }
    }
}
</script>
