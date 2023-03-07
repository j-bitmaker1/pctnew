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
        dwidth : state => state.dwidth,
        auth : state => state.auth,

        mobileview : function(){
            return this.dwidth <= 768
        },

        many : function(){
            return _.toArray(this.portfolios).length > 1
        }
    }),

    methods : {
        load : function(){
            this.loading = true

			this.core.pct.scenarios().then(scenariosInfo => {
                var info = {}
                
                _.each(scenariosInfo, (i) => {
                    info[i.id] = i
                })

                this.info = info

            }).finally(() => {
                this.loading = false
            })
        },
        toScenario : function(scenario){
            if (this.mobileview){
                this.$refs.ctdetails.toScenario(scenario)
            }
		},

        toScenarioDirectOne : function(scenario){
            if (!this.mobileview && !this.many){

                

                this.toScenarioDirect({scenario, key : _.toArray(this.portfolios)[0].id})
            }
        },

        toScenarioDirectMany: function({scenario, key}){
            if (!this.mobileview && this.many){
                this.toScenarioDirect({scenario, key})
            }
        },

        toScenarioDirect: function({scenario, key}){

            var i = key

            var ct = this.cts.cts[i]

            var _scenario = {
                id : scenario.id,
                name : scenario.name,
                loss : scenario.loss[i] * this.cts.total
            }

            var portfolio = this.portfolios[i]

            this.$store.commit('OPEN_MODAL', {
                id: 'modal_portfolio_crashtest_scenariodetails',
                module: "portfolio_crashtest_scenariodetails",
                caption: _scenario.name,
                data : {
                    ct : ct,
                    scenario : _scenario,
                    portfolio : portfolio
                }
            })
          
			
		},
    },
}