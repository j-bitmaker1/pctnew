import { mapState } from 'vuex';
import scenario from '../scenario/index.vue'

export default {
	name: 'portfolio_crashtest_details',
	props: {
		ct : {
			type : Object,
			default : () => {return {}}
		}
	},
	components : {
		scenario
	},
	data : function(){

		return {
			loading : false,
			lighted : null
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
				id: 'modal_portfolio_crashtest_scenariodetails',
				module: "portfolio_crashtest_scenariodetails",
				caption: scenario.name,
				data : {
					ct : this.ct,
					scenario : scenario
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

			if (r){
            	setTimeout(() => {
					r.$el.closest('.customscroll').scrollTop = r.$el.offsetTop - 100
            	}, 50)

				/*setTimeout(() => {
					this.select(scenario)
				}, 1000)*/
			}

			this.light(scenario)
		}
	},
}