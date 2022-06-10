<template>
    <span>
        <span v-if="valid">{{ model && model.join(', ') }}</span>
        <span v-else>Invalid data array</span>
    </span>
</template>
<script>
export default {
    props:['data', 'cell'],
    data(){ return{
        valid: true,
        model: []
    }},
    mounted () {
      this.checkFormat(this.data)
    },
    methods:{
        checkFormat(data){
            if( data === null || data === undefined) 
            this.model = []
            if( Array.isArray(data) ){
            this.valid = true
            this.model = data
            }else if( typeof data == 'string' && data.includes('[') ){
                try {
                    this.model = JSON.parse(data);
                    this.valid = true
                } catch (e) {
                    this.valid = false;
                }
            }else{
                this.valid = false;
            }
        }
    }
}
</script>