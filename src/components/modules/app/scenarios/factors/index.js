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
        inbps : function(factor){


            if (factor.type == 'country' || 
                factor.type == 'currency' || 
                factor.type == 'industry' || 
                factor.type == 'perm_factor' || 
                factor.type == 'stress_index'
                ) return false

            return true
        },

        value : function(factor){
            if (this.inbps(factor)){
                return (factor.value * 100).toFixed(0) + 'bps'
            }
            else{   
                return (factor.value / 100)
            }
        }
    },
}