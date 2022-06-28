import { mapState } from 'vuex';
import cmenu from "../menu/index.vue"
import moment from 'moment'


export default {
    name: 'emails_templates_preview',
    props: {
        template : Object
    },

    components : {
        cmenu
    },

    data : function(){

        return {
            loading : false
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        info : function(){

            return this.core.campaigns.campaignTemplates.contentInfo(this.template.content)
        },

        medianTime : function(){
            return moment.duration(this.info.medianTime, 'seconds').humanize(true);
        }
    }),

    methods : {
        open : function(){
            this.$emit('open')
        }
    },
}