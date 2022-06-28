import { mapState } from 'vuex';
import smeta from '../meta/index.vue'


export default {
    name: 'campaign_step_subcampaign',
    props: {
        step : Object,
        editing : Boolean,
        level : Number
    },

    components : {
        smeta,
    },

    data : function(){

        return {
            loading : true,
            template : null,
            expanded : false
        }

    },

    created (){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        result : function(){
        }
    }),

    methods : {
        load : function(){

            if (this.step.subcampaign){
                this.loading = true


                this.core.campaigns.getTemplate(this.step.subcampaign).then(r => {

                    this.template = r

                    console.log("r", r)

                }).finally(() => {
                    this.loading = false
                })
            }

        }
    },
}