import { mapState } from 'vuex';
import smeta from '../meta/index.vue'
export default {
    name: 'campaign_step_email',
    props: {
        step : Object,
        editing : Boolean
    },

    components : {
        smeta
    },

    data : function(){

        return {
            loading : true,
            template : null
        }

    },

    created() {
        //this.load()
    },

    watch: {
        templateId : {
            immediate : true,
            handler : function(){
                this.load()
            }
        }
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        templateId : function(){
            return this.step.template
        }
    }),

    methods : {
        load : function(){
            this.loading = true

            this.core.campaigns.getEmailTemplate(this.step.template).then(r => {

                this.template = r
            }).finally(() => {
                this.loading = false
            })
        }
    },
}