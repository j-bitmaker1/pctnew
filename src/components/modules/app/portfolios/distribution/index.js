import { mapState } from 'vuex';

import {Chart} from 'highcharts-vue'

import options from '@/application/hc.js'
import summarybutton from '@/components/delements/summarybutton/index.vue'

export default {
    name: 'distribution',
    props: {
    },

    components : {
        highcharts : Chart,
        summarybutton
    },

    data : function(){

        return {
            loading : false,
            deviation : {},

            colors : [
                'rgba(100,101,100,1)',
                'rgba(248,95,29,1)',
                'rgba(100,101,100,1)'
            ],

            summary : [

                {
                    text : 'labels.sharperatio',
                    index : 'longTermReturn'
                },
                {
                    text : 'labels.standartdeviation',
                    index : 'standardDeviation'
                }
                
            ]
        }

    },

    created : function(){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        series : function(){

            var series = [];

        

            series.push({
	            name: 'Before SDR',
	            type: 'areaspline',
	            lineColor: this.colors[0],
	            fillColor: this.colors[0].replace(',1)', ',0.60)'),
	            showInLegend: false,
	            data: [{
                    x : 10,
                    y : 20
                },{
                    x : 20,
                    y : 40
                }]
	        });

	        series.push({
	            name: 'Standart Deviation Range',
	            type: 'areaspline',
	            color: this.colors[1],
	            lineColor: this.colors[1],
	            fillColor: this.colors[1].replace(',1)', ',0.60)'),
	            showInLegend: true,
	            data: [{
                    x : 10,
                    y : 20
                },{
                    x : 32,
                    y : 40
                }]
	        });

	        series.push({
	            name: 'After SDR',
	            type: 'areaspline',
	            lineColor: this.colors[2],
	            fillColor: this.colors[2].replace(',1)', ',0.60)'),
	            showInLegend: false,
	            data: [{
                    x : 10,
                    y : 20
                },{
                    x : 60,
                    y : 40
                }]
	        });

            return series
        },

        chartOptions: function(){

            var d = options()

                d.chart.height = 400
                d.chart.plotBorderWidth = null
			    d.chart.type = 'areaspline'

                d.plotOptions.areaspline.dataLabels.style || (d.plotOptions.areaspline.dataLabels.style = {});
                d.plotOptions.areaspline.dataLabels.style.textOutline = false
                d.plotOptions.areaspline.animation = false;
                d.plotOptions.areaspline.allowPointSelect = false;
                d.plotOptions.areaspline.lineWidth = 1;
                d.plotOptions.column.borderWidth = 0

			    d.plotOptions.series.marker.enabled = false;

                d.title = { text: (''), style: { color: "#000000", fontSize : 12  + 'px' } }
               
                d.series = this.series

            return d
        }
    }),

    methods : {
        load : function(){
            this.loading = true

            this.core.pct.getStandartDeviation().then(r => {

                this.deviation = r

                console.log('this.deviation', this.deviation)

                return Promise.resolve(r)
            }).finally(() => {
                this.loading = false
            })
        }
    },
}