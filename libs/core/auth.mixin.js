import {  get } from 'lodash'
import {  mapGetters } from 'vuex'
export default  {
    created() {
        // if( !get(this.auth, 'isLogged', false) && !get(this.$route, 'path', '').includes('pages') ) 
        //     this.$router.push('/pages/login')
        // if( !this.hasAuth && get(this.$route, 'path', '').includes('pages') )
        //     this.$router.push('/dashboard')

            
        // this.$store.watch(
        //     state => state.auth.dash, 
        //     (next, prev) => {
        //         if( next ){
        //             if( this.hasAuth && !get(next, 'isLogged', false) && !this.$route.path.includes('pages') ) 
        //                 this.$router.push('/pages/login')
        //             if( this.hasAuth && get(next, 'isLogged', false) && !get(prev, 'isLogged', false) && this.$route.path.includes('pages')) 
        //                 this.$router.push('/dashboard')
        //             if( !this.hasAuth && this.$route.path.includes('pages') )
        //                 this.$router.push('/dashboard')
        //         }
        //     }, 
        //     { immediate: true }
        // )
        console.log(this.$route)
    }, 
    computed:{
        auth(){ return this.$store.state.auth.dash || {} },
        hasAuth(){ return process.env.VUE_APP_LOGIN === 'true' }
    },
    methods:{
        async isLogged(){
            await this.$store.dispatch('isLogged', {})
        }
    }
}