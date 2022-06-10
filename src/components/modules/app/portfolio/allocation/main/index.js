import { mapState } from 'vuex';
import f from '@/application/functions.js'
import serie from '../serie/index.vue'
import { Allocation } from '@/application/charts/index';
import {Chart} from 'highcharts-vue'

var allocation = new Allocation()

export default {
    name: 'allocation_main',
    props: {
        activegrouping : String,
        assets : Array,

		options : {
			type : Object,
			default : () => {return {}}
		}
    },

    components : {
        highcharts : Chart,
		serie
    },

    data : function(){

        return {
            loading : false,
            drilldown : null,
			assetsinfo : {}
        }

    },

    created : () => {

    },

    watch: {
        activegrouping : function(){
            this.drilldown = null
        },

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

			var d = allocation.chartOptions(this.chartdata, {
				...this.options
			})

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
    }),

    methods : {
        drillup : function(e){
			this.drilldown = null
		}, 
		drilldownevent : function(e){

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