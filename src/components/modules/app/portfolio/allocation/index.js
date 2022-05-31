import { mapState } from 'vuex';
import {Chart} from 'highcharts-vue'

import options from '@/application/hc.js'
import f from '@/application/functions.js'

import assets from '@/components/modules/app/assets/list/index.vue'
import _ from 'underscore';

import serie from './serie/index.vue'

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

			chartcolors : ['#F2994A', '#9B51E0', '#219653', '#2F80ED', '#56CCF2', '#BB6BD9', '#EB5757'],

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
			var serie = {
				minPointSize: 10,
				innerSize: '80%',
				name: "Portfolio Weight",
				data : [],
				colorByPoint: true,
				size: '100%'
			}
			var drilldown = []

			var c = 0
			
			_.each(this.grouped, (g, i) => {
				var point = {}

				point.name = i
				point.drilldown = i
				point.color = this.colorbyindex(c)

				c++

				point.y = _.reduce(g, (m, asset) => {
					return m + asset.value
				}, 0)
				

				serie.data.push(point)

				var drilldownserie = {
					name : i,
					id : i,
					minPointSize: 10,
					size: '100%',
					innerSize: '80%',
					colorByPoint : true,
					data : [],
				}

				_.each(g, (asset, i) => {

					var point = {
						name : asset.ticker,
						y : asset.value,
						color : this.colorbyindex(i)
					}

					drilldownserie.data.push(point)
				})

				drilldown.push(drilldownserie)
			})

			return {
				serie,
				drilldown : {
					series : drilldown
				}
			}
		},

		chartOptions: function(){

			var d = options()
			var chartdata = this.chartdata

				d.chart.height = 400
				d.chart.type = 'pie'
				d.legend.enabled = false
				d.title = { text: (''), style: { color: "#000000", fontSize : 12  + 'px' } }
				d.plotOptions.pie.showInLegend = false
				d.plotOptions.pie.animation = true
				d.plotOptions.pie.allowPointSelect = false
				d.plotOptions.pie.size = '90%'
				d.plotOptions.pie.colorByPoint = true

				d.series = [chartdata.serie]
				d.drilldown = chartdata.drilldown

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

		colorbyindex : function(i){
			return this.chartcolors[i % this.chartcolors.length]
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
				//console.log("item", item, this.$refs.chart) drilldown chart
				//this.$refs.chart.chart.drilldown.update(item.drilldown)
				
			}
		}
	},
}