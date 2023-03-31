import { mapState } from 'vuex';
import f from '@/application/shared/functions.js'
export default {
	name: 'portfolio_crashtest_chart',
	props: {
		cts : Object,
		mode : {
            type : String,
            default : 'd'
        },
		mobileview : Boolean,
		portfolios : Object,
		chartheight : Number
	},

	data : function(){

		return {
			loading : false,
			intervals : 2,
			zoomed : null
		}

	},

	created : function() {
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		dwidth : state => state.dwidth,
		dheight : state => state.dheight,
		roundbase : function(){
			if(!this.cts.total) return 0
			return Math.pow(10, Math.max((this.cts.total.toFixed(0)).length - 3, 1))
		},
		dollars : state => state.dollars,
		length : function(){
			return _.toArray(this.cts.scenarios).length
		},

		currentStyles : state => state.currentStyles,

		modecomposed : function(){
			if(this.dollars == 'd') return this.mode

			return this.dollars
		},

		many : function(){
			return _.toArray(this.portfolios).length > 1
		},

		calcheight : function(){
			return this.chartheight > 0 && this.length < 14 && this.dheight > 400
		}
	}),

	methods : {
		rcolor : function(v){
			return f.colorFromRatingGradient(v)
		},
		height : function(scenario, loss){

			if(!this.cts.max) return 0

			return 100 * Math.abs(loss) / this.cts.max

		},

		color : function(scenario, loss){

			if (scenario.id < 0){
				return 'rgb(' +this.$store.getters.currentStyleValue('--color-yellow') + ')'
			}

			if (scenario.custom){
				return 'rgb(' +this.$store.getters.currentStyleValue('--color-txt-ac') + ')'
			}

			return this.$store.getters.colorByValue(loss)

		},

		num : function(index){


			var v = (index) * (this.cts.total * this.cts.max / this.intervals)
			
			if(this.mode == 'p'){
				return v
			}
			else{
				
				if(this.dollars == 'd'){
					return f.round(v, this.roundbase) || 0
				}
				else{
					return (index) * (this.cts.max / this.intervals)
				}
				
			}
		},


		scenarioClick : function(scenario){
			this.$emit('scenarioClick', scenario)
		},

		scenarioClickDirect: function(scenario, key){
			this.$emit('scenarioClickDirect', {scenario, key})
		},

		scenarioClickDirectOne: function(scenario){
			this.$emit('scenarioClickDirectOne', scenario)
		},

		scenarioMouseOverDirectOne: function(scenario){
			this.$emit('scenarioMouseOverDirectOne', scenario)
		},

		zoom : function(id){
            this.zoomed = id

            setTimeout(() => {
                if(this.zoomed == id) this.zoomed = null
            }, 2000)
        }
	},
}