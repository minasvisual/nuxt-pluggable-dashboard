<template>
<span >
    <img  @click="showModal(data)" :src="data" style="height: 30px; width:auto" @error="replaceByDefault" />
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
           this.$modal(`<img src="${item}" class="img-fluid">`)
        }
    }
}
</script>