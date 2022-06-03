import { mapState } from 'vuex';

import {Chart} from 'highcharts-vue'

import summarybutton from '@/components/delements/summarybutton/index.vue'
import _ from 'underscore';
import f from '@/application/functions.js'


import { Distribution } from '@/application/charts/index';

var distribution = new Distribution()

export default {
	name: 'distribution',
	props: {
		portfolio : Object
	},

	components : {
		highcharts : Chart,
		summarybutton
	},

	data : function(){

		return {
			loading : false,
			deviation : {},

			summary : [

				{
					text : 'labels.sharperatio',
					index : 'sharpeRatio'
				},
				{
					text : 'labels.standartdeviation',
					index : 'standardDeviation'
				}
			],

			periods : [
				{
					value : 0.25,
					text : 'labels.025year'
				},
				{
					value : 0.5,
					text : 'labels.05year'
				},
				{
					value : 1,
					text : 'labels.1year'
				},
				{
					value : 3,
					text : 'labels.3years'
				}
			],

			stds : [
				{
					value : 1,
					text : 'labels.68std'
				},
				{
					value : 2,
					text : 'labels.95std'
				},
				{
					value : 3,
					text : 'labels.997std'
				}
			],

			period : 1,
			current_std :2
		}

	},

	created : function(){
	},

	watch: {
		portfolio : {
			immediate : true,
			handler : function(){
				this.load()
			}
		}
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,

		series : function(){

			return distribution.series({
				total : this.portfolio.total(),
				locale : this.core.user.locale,
				deviation : this.deviation,
				period : this.period,
				current_std : this.current_std
			})

		},

		chartOptions: function(){

			return distribution.chartOptions(this.series)

		}
	}),

	methods : {
		load : function(){
			this.loading = true

			this.core.pct.standartDeviation(this.portfolio.id).then(r => {
			//this.core.pct.getStandartDeviation().then(r => {
				this.deviation = r

				return Promise.resolve(r)
			}).finally(() => {
				this.loading = false
			})
		},

		changeperiod : function(e){
			this.period = e.target.value
		},

		changestd : function(e){
			this.current_std = e.target.value
		}
	},
}