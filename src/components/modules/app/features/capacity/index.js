import { mapState } from 'vuex';

import f from '@/application/shared/functions.js'
import VueSlider from 'vue-slider-component'
import _ from 'underscore';

import { MonteCarlo } from '@/application/charts/index';
import {Chart} from 'highcharts-vue'
import slider from '@/components/assets/slider/index.vue'

var monteCarlo = new MonteCarlo()

export default {
	name: 'features_capacity',
	props: {
		initial : {
			type : Object,
			default : () => {
				return {}
			}
		}
	},

	components : {
		highcharts : Chart,
		VueSlider,
		slider
	},

	data : function(){

		return {
			loading : false,
			simulation : {},

			defaultvalues : monteCarlo.defaultValues(),

			made : false,

			values : {}
		}

	},

	created : function(){
		this.init()
	},

	watch: {
		['simulation.capacity'] : {
			immediate : false,
			deep : true,
			handler : function(){

				this.$emit('change', {
					values : this.values,
					capacity : this.simulation.capacity
				})
			}
		},
		values : {
			immediate : false,
			deep : true,
			handler : function(){
				if (this.made)
					this.make()
			}
		},

		/*initial : {
			immediate : true,
			handler : function(){
				this.init()
			}
		}*/
	},
	computed: mapState({
		auth : state => state.auth,

		sliders : function(){
			console.log('this.values.salary', this.values.salary)
			return {
				'ages' : {
					text : "Age Horizon",
					
					mode : '',

					options : {
						min : 18,
						max : 99,
						interval : 1,
						maxRange : 50,
						type : [Number, Number],
					}
				},

				'savings' : {
					text : "Initial Investment",
					
					mode : 'd',

					options : {
						min : 0,
						max : Math.max(f.round(this.values.salary ? this.values.salary * 3 : 10000000, 1000), 100000),
						interval : 1000,
						type : Number,
					}
				},

				'savemoreRange' : {
					text : "Saving Horizon",
					
					mode : '',

					options : {
						min : this.values.ages[0],
						max : this.values.ages[1],
						interval : 1,
						maxRange : 50,
						type : [Number, Number],
					}
				},

				'withdrawRange' : {
					text : "Withdrawal Horizon",
					
					mode : '',

					options : {
						min : this.values.ages[0],
						max : 99,
						interval : 1,
						maxRange : 50,
						type : [Number, Number],
					}
				},

				

				'save' : {
					text : "Yearly Savings",
					
					mode : 'd',

					options : {
						min : 0,
						max : Math.max(f.round(this.values.salary ? this.values.salary/* / 12 */: 1000000, 1000), 100000),
						interval : 1000,
						type : Number,
					}
				},

				'salary' : {
					text : "Terminal Value",
					mode : 'd',
					options : {
						min : 0,
						max : Math.max(f.round(this.values.salary ? this.values.salary * 2 : 1000000, 1000), 100000),
						interval : 1000,
						type : Number,
					}
				}, 

				'withdraw' : {
					text : "Withdraw",
					
					mode : 'd',

					options : {
						min : 0,
						max : Math.max(f.round(this.values.salary ? this.values.salary/* / 12 */: 100000, 1000), 100000),
						interval : 1000,
						type : Number,
					}
				},

				
			}
		},

		options : function(){

			if(_.isEmpty(this.values)) return {}

			return {
				age : this.values.ages[0],
				retire : this.values.ages[1],
				savings : this.values.savings,
				save : this.values.save,
				withdraw : this.values.withdraw,
				salary : this.values.salary //terminal value
			}
		},

		extra : function(){

			if(_.isEmpty(this.values)) return {}

			return {
				savemoreRange1 : this.values.savemoreRange[0],
				savemoreRange2 : this.values.savemoreRange[1],
				withdrawRange1 : this.values.withdrawRange[0],
				withdrawRange2 : this.values.withdrawRange[1],
				withdraw : this.values.withdraw
			}
		},

		chartOptions: function(){

			return monteCarlo.chartOptions({
				simulation : this.simulation,
				dataoptions : this.options
			})
		},
	   
	}),

	methods : {
		init : function(){
			this.values = {
				... this.defaultvalues,
				... this.initial
			}


			this.make()

		},
		make : function(){

			this.calculate()

			this.made = true
		},

		calculate : function(){
			var capacity = new this.core.pct.capacity({
	            options : this.options,
                extra : this.extra
            })

            this.simulation = capacity.simulation()

        }
    },
}