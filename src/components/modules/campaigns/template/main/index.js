import { mapState } from 'vuex';

import status from '../../status/index.vue'
import f from "@/application/shared/functions.js"
export default {
    name: 'campaigns_template_main',
    props: {
        campaignTemplate : Object
    },

    components : {
        status
    },
    data : function(){

        return {
           
        }

    },

    created() {
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        haschanges : function(){
            return true
        },
        auth : state => state.auth,
        steps : function(){

            console.log('this.campaignTemplate', this.campaignTemplate)

            return this.campaignTemplate.content
        }
    }),

    methods : {
        load : function(){

          
        },

        save : function(){},
        cancel : function(){}
    },
}