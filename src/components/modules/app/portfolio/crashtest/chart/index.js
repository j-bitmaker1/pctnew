import { mapState } from 'vuex';
import f from '@/application/functions.js'
export default {
	name: 'portfolio_crashtest_chart',
	props: {
		cts : Object,
		mode : {
            type : String,
            default : 'd'
        }
	},

	data : function(){

		return {
			loading : false,
			intervals : 3
		}

	},

	created : () => {

	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		
		roundbase : function(){
			return Math.pow(10, Math.max((this.cts.total.toFixed(0)).length - 3, 1))
		},

		currentStyles : state => state.currentStyles
	}),

	methods : {
		height : function(scenario, loss){

			if(!this.cts.max) return 0

			return 100 * Math.abs(loss) / this.cts.max

		},

		color : function(scenario, loss){

			if (scenario.id < 0){
				return 'rgb(' +this.$store.getters.currentStyleValue('--color-yellow') + ')'
			}

			return this.$store.getters.colorByValue(loss)

		},

		num : function(index){
			var v = (index) * (this.cts.total * this.cts.max / this.intervals)
			
			if(this.mode == 'p'){
				return v
			}
			else{
				return f.round(v, this.roundbase) || 0
			}
		},


		scenarioClick : function(scenario){
			this.$emit('scenarioClick', scenario)
		}
	},
}