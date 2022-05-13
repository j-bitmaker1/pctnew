import { mapState } from 'vuex';
import {Chart} from 'highcharts-vue'

import options from '@/application/hc.js'
import f from '@/application/functions.js'

import assets from '@/components/modules/app/assets/list/index.vue'
import _ from 'underscore';

export default {
    name: 'allocation',
    props: {
        assets : Array
    },


    data : function(){

        return {
            loading : false,
            activegrouping : 'group',
            groups : [
                {
                    text : 'labels.bygroup',
                    id : 'group'
                },

                {
                    text : 'labels.bysector',
                    id : 'sector'
                }
            ]
        }

    },

    components : {
        highcharts : Chart,
        assets
    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
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
                return a[this.activegrouping]
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
            
            _.each(this.grouped, (g, i) => {
                var point = {}

                point.name = i
                point.drilldown = i
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
                    color : "#000"
                }

                _.each(g, (asset) => {
                    //var point = [asset.ticker, asset.value]
                    var point = {
                        name : asset.ticker,
                        y : asset.value,
                        color : "#000"
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

            console.log("D,", d)

            return d
        },

        currentSerie : function(){
            return chartdata.serie.data
        },

        legend : function(){

        }

    }),

    methods : {
        grouping : function(){

        },

       
    },
}