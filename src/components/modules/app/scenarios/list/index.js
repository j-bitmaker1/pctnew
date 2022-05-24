import { mapState } from 'vuex';

export default {
    name: 'scenarios_list',
    props: {
        select : {
            type : Object,
            default : () => {
                return {
                    context : 'scenario'
                }
            }
        }
    },

    data : function(){

        return {
            loading : false,
            scenarios : []
        }

    },

    created () {
        this.get()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        menu : function(){
            return null
        }
    }),

    methods : {
        get : function(){
            this.core.pct.scenarios().then(scenarios => {
				this.scenarios = scenarios
			})
        }
    },
}