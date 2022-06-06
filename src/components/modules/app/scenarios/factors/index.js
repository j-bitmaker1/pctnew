import { mapState } from 'vuex';

export default {
    name: 'scenarios_factors',
    props: {
        info : {
            type : Object,
            default : () => {
                return {}
            }
        }
    },

    data : function(){

        return {
            loading : false
        }

    },

    created(){
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