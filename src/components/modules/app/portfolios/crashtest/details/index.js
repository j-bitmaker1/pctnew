import { mapState } from 'vuex';
import scenario from '../scenario/index.vue'

export default {
    name: 'portfolios_crashtest_details',
    props: {
        ct : Object
    },
    components : {
        scenario
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
        maxabs : function(){
            return Math.max(Math.abs(this.ct.profit), Math.abs(this.ct.loss))
        },
       

        
    }),

    methods : {
        select : function(scenario){

            this.$store.commit('OPEN_MODAL', {
                id: 'modal_portfolios_crashtest_scenariodetails',
                module: "portfolios_crashtest_scenariodetails",
                caption: scenario.name,
                data : {
                    ct : this.ct,
                    scenario : scenario
                }
            })

        }
    },
}