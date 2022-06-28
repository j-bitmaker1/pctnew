import { mapState } from 'vuex';
import smeta from '../meta/index.vue'
import moment from 'moment'
export default {
    name: 'campaign_step_lead',
    props: {
        step : Object,
        editing : Boolean
    },

    components : {
        smeta
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
        auth : state => state.auth
    }),

    methods : {
        
    },
}