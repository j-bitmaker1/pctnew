import { mapState } from 'vuex';
import smeta from '../meta/index.vue'
import moment from 'moment'
export default {
    name: 'campaign_step_whilestep',
    props: {
        step : Object,
        editing : Boolean,
        refer : Object
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

    created (){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        duration : function(){
            return moment.duration(this.step.timeleft() || this.step.duration(), 'seconds').humanize(true);
        },
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