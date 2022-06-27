import { mapState } from 'vuex';
import f from '@/application/shared/functions.js'
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
		},
		portfolio : Object,
		colors : Object
    },

    components : {
        highcharts : Chart,
		serie
    },

    data : function(){

        return {
            loading : false,
            drilldownLevel : null,
			assetsinfo : {}
        }

    },

    created : () => {

    },

    watch: {
        activegrouping : function(){
            this.drilldownLevel = null
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
			return allocation.chartData(this.grouped, this.colors)
		},

		chartOptions: function(){

			var d = allocation.chartOptions(this.chartdata, {
				...this.options
			})

				d.chart.events = {}
				d.chart.events.drilldown = this.drilldownevent
				d.chart.events.drillup = this.drillupevent
				

			return d
		},

		currentSerie : function(){

			if(this.drilldownLevel){
				return _.find(this.chartdata.drilldown.series, (s) => {
					return s.id == this.drilldownLevel.id
				})
			}

			return this.chartdata.serie
		},
    }),

    methods : {
        drillup : function(){
			this.drilldownLevel = null

				this.$emit('drillup')
		}, 

		drilldown : function(obj){
			this.drilldownLevel = obj
			this.$emit('drilldown', this.drilldownLevel.id)
		},

		drillupevent : function(e){
			this.drillup()
		},

		drilldownevent : function(e){
			this.drilldown(e.seriesOptions)
		},

		get : function(){
			this.core.pct.assets(this.assets).then(r => {
				this.assetsinfo = r

				this.$emit('groups', this.grouped)

				return Promise.resolve(r)
			})
		},

		doDrillup : function(notemit){
			if(!f.deep(this.$refs, 'chart.chart')) return

			this.$refs.chart.chart.drillUp()
		},

		doDrilldown : function(drilldown){
			if(!this.drilldownLevel){

				if(!f.deep(this.$refs, 'chart.chart.series.0')) return

				var point = _.find(this.$refs.chart.chart.series[0].points, (p) => {
					return p.drilldown == drilldown
				})

				if(!point) return

				point.doDrilldown()
			}
		},

		clickLegend : function(item){
			if(item.drilldown){
				this.doDrilldown(item.drilldown)
			}
		}
    },
}