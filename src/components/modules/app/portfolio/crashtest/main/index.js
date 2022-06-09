import { mapState } from 'vuex';
import chart from '../chart/index.vue'
import ctdetails from '../details/index.vue'
export default {
    name: 'crashtest_main',
    props: {
        cts : Object,
        portfolios : Object,
        mode : {
            type : String,
            default : 'd'
        }
    },

    components : {
        chart, ctdetails
    },

    data : function(){

        return {
            loading : true,
            info : null
        }

    },

    created(){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        load : function(){
            this.loading = true

            console.log("CTS", this.cts)

			this.core.pct.scenarios().then(scenariosInfo => {
                var info = {}
                
                _.each(scenariosInfo, (i) => {
                    info[i.id] = i
                })

                this.info = info

                console.log('scenariosInfo', info)
            }).finally(() => {
                this.loading = false
            })
        },
        toScenario : function(scenario){
			this.$refs.ctdetails.toScenario(scenario)
		},
    },
}