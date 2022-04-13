 import { get } from 'lodash'
 import { mergeDeep, sendType } from '../services/helpers'
 
 export default {
     data(){
        return{
            action:{}
        }
     },
     methods:{
        sendType,
        redirect(project, domain){
            if( !confirm(`Are you sure to redirect to ${domain}`) ) return;
            
            this.$router.push(`/api/${project}/${domain}`) 
         },
         openModel({ schema, overwrite = {} }){
             console.debug("action openModel called", schema, overwrite)
            this.action = {
                type: "modal:grid",
                show: true, 
                schema,
                overwrite
            }
         },
         openForm({ schema, overwrite = {}, row = {} }){
            this.action = {
                type: "modal:form",
                show: true, 
                schema,
                overwrite,
                row
            }
         }
     }
 }