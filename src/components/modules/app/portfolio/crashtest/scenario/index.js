import { _ } from 'core-js';
import { mapState } from 'vuex';

export default {
	name: 'portfolio_crashtest_scenario',
	props: {
		scenario : Object,
		cts : Object,
		mode : {
            type : String,
            default : 'd'
        },
		portfolios : Object
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
		currentStyles : state => state.currentStyles,
		showNames : function(){
			console.log('this.portfolios, this.portfolios', this.portfolios)
			return _.toArray(this.portfolios || {}).length > 1
		}
	}),

	methods : {
		width : function(loss){
			if(!this.cts.max) return 0

			return 100 * Math.abs(loss) / this.cts.max

		},

		color : function(loss){

			if (this.scenario.id < 0){
				return 'rgb(' +this.$store.getters.currentStyleValue('--color-yellow') + ')'
			}

			return this.$store.getters.colorByValue(loss)
		},

		select : function(i){
			this.$emit('select', i)
		},

		showName : function(i){
			var portfolio = this.portfolios[i]

			return portfolio.name
		}
	},
}