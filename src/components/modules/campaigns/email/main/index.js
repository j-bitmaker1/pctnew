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
            steps : [],
            prev : '',
            name : ''
        }

    },

    created() {
        this.prevsteps = JSON.stringify(this.campaignTemplate.content)
        this.steps = this.core.campaigns.campaignTemplates.clonelist(this.campaignTemplate.content)
        this.name = this.campaignTemplate.name
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        haschanges : function(){
            return JSON.stringify(this.steps) != this.prevsteps || this.name != this.campaignTemplate.name
        },
        auth : state => state.auth
    }),

    methods : {

        change : function(steps){
            this.steps = steps
        },

        save : function(){},
        cancel : function(){}
    },
}