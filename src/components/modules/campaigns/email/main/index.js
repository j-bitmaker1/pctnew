import { mapState } from 'vuex';

import status from '../../status/index.vue'
import f from "@/application/shared/functions.js"
export default {
    name: 'campaigns_template_main',
    props: {
        emailTemplate : Object
    },

    components : {
        status
    },
    data : function(){

        return {
            prev : '',
            name : ''
        }

    },

    created() {
        this.prevsteps = JSON.stringify(this.emailTemplate)
        this.name = this.emailTemplate.name
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        haschanges : function(){
            return false
        },
        auth : state => state.auth
    }),

    methods : {

        change : function(steps){
        },

        save : function(){},
        cancel : function(){}
    },
}