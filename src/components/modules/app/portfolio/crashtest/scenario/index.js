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
			return _.toArray(this.portfolios || {}).length > 1
		},
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

			if(_.toArray(this.scenario.loss).length > 1) this.$emit('select', i)
		},

		selectIfOne: function(){

			if(_.toArray(this.scenario.loss).length == 1){
				var index = 0
				
				_.find(this.scenario.loss, (v, i) => {
					index = i
					return true
				})

				this.$emit('select', index)

			}


		},

		showName : function(i){
			var portfolio = this.portfolios[i]

			return portfolio.name
		}
	},
}