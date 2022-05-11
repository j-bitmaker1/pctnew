import { mapState } from 'vuex';
import action from "@/components/modules/notifications/action/index.vue";

export default {
    name: 'notification',
    props: {
        event : {
            type : Object,
            default : () => {return {

            }}
        }
    },
    components : {action},

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