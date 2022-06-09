import { mapState } from 'vuex';
import scenario from '../scenario/index.vue'

export default {
	name: 'portfolio_crashtest_details',
	props: {
		cts : {
			type : Object,
			default : () => {return {}}
		},
		portfolios : Object,

		mode : {
            type : String,
            default : 'd'
        }
	},
	components : {
		scenario
	},
	data : function(){

		return {
			loading : false,
			lighted : null,
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
		select : function(scenario, i){

			var ct = this.cts.cts[i]

			var _scenario = {
				id : scenario.id,
				name : scenario.name,
				loss : scenario.loss[i] * this.cts.total
			}

			var portfolio = this.portfolios[i]

			console.log("this.portfolios", this.portfolios, i)

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

		light : function(scenario){
			this.lighted = scenario.id

			setTimeout(() => {
				this.lighted = null
			}, 1000)
		},

		toScenario : function(scenario){
			var r = this.$refs[scenario.id]

			console.log("scenario", scenario)

			if (r){
            	setTimeout(() => {
					r.$el.closest('.customscroll').scrollTop = r.$el.offsetTop - 100
            	}, 50)
			}

			this.light(scenario)
		}
	},
}