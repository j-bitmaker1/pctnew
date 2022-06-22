import { mapState } from 'vuex';
import smeta from '../meta/index.vue'


export default {
    name: 'campaign_step_ifstep',
    props: {
        step : Object,
        editing : Boolean,
        level : Number,
        refer : Object
    },

    components : {
        smeta,
    },

    data : function(){

        return {
            loading : true,
            template : null
        }

    },

    created (){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth
    }),

    methods : {
        load : function(){
            if(this.refer){

                this.loading = true
                this.core.campaigns.getEmailTemplate(this.refer.MailTemplateId).then(r => {
                    this.template = r
                }).finally(() => {
                    this.loading = false
                })

            }
        }
    },
}