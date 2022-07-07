import { mapState } from 'vuex';
import smeta from '../meta/index.vue'
export default {
    name: 'campaign_step_start',
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
        auth : state => state.auth,
    }),

    methods : {
        
    },
}