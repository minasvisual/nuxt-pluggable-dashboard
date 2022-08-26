<template>
<span >
    <img  @click="showModal(data)" :src="data" style="height: 30px; width:auto" @error="replaceByDefault" />
    
    <teleport to="body">
        <CommonsModal ref="dialog" v-model:show="formopen" >
            <img :src="data" />
        </CommonsModal>
    </teleport>
</span>
</template>
<script>
export default {
    props:['data', 'cell'],
    data(){ return{
        formopen: false
    }},
    methods: {
        replaceByDefault(e) {
            e.target.src = ''
        },
        showModal(item){ 
           this.$emit("click", this.data)
           this.formopen = true
            this.$message(`teste mensagem`)
        }
    }
}
</script>