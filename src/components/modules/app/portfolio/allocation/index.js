import { mapState } from 'vuex';
import {Chart} from 'highcharts-vue'

import f from '@/application/functions.js'

import assets from '@/components/modules/app/assets/list/index.vue'
import _ from 'underscore';

import serie from './serie/index.vue'

import { Allocation } from '@/application/charts/index';

var allocation = new Allocation()

export default {
	name: 'allocation',
	props: {
		assets : Array,
	},

	components : {
		highcharts : Chart,
		assets,
		serie
	},
	data : function(){

		return {
			loading : false,
			activegrouping : 'type',
			groups : [
				{
					text : 'labels.bygroup',
					id : 'type'
				},

				{
					text : 'labels.bysector',
					id : 'sector'
				}
			],

			drilldown : null,

			assetsinfo : {}
		}

	},

   

	created : () => {

	},

	watch: {
        assets : {
            immediate : true,
            handler : function() {
                this.get()
            }
        }
    },
	computed: mapState({
		auth : state => state.auth,

		joined : function(){
			var jg = {}

			_.each(this.assets, (a) => {
				if(!jg[a.ticker]){
					jg[a.ticker] = a 
				}
				else{
					jg[a.ticker].value += a.value
				}
			})
			
			return _.toArray(jg)
		},

		grouped : function(){
			return f.group(this.joined, (a) => {

				var info = this.assetsinfo[a.ticker]


				if(!info) return "Not covered"

				return info[this.activegrouping] || 'Other'
			})
		},

		chartdata : function(){
			return allocation.chartData(this.grouped)
		},

		chartOptions: function(){

			var d = allocation.chartOptions(this.chartdata)

				d.chart.events = {}
				d.chart.events.drilldown = this.drilldownevent
				d.chart.events.drillup = this.drillup
				

			return d
		},

		currentSerie : function(){

			if(this.drilldown){
				return _.find(this.chartdata.drilldown.series, (s) => {
					return s.id == this.drilldown.id
				})
			}

			return this.chartdata.serie
		},

		legend : function(){

		}

	}),

	methods : {
		grouping : function(e){
			this.drilldown = null
			this.activegrouping = e.target.value
		},

	
		drillup : function(e){

			this.drilldown = null
		}, 
		drilldownevent : function(e){

			console.log("E", e)

			this.drilldown = e.seriesOptions
		},

		get : function(){
			this.core.pct.assets(this.assets).then(r => {
				this.assetsinfo = r
				return Promise.resolve(r)
			})
		},

		clickLegend : function(item){
			if(!this.drilldown && item.drilldown){
				this.drilldown = {
					id : item.drilldown
				}
			}
		}
	},
}