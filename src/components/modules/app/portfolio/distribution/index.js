import { mapState } from 'vuex';

import {Chart} from 'highcharts-vue'

import options from '@/application/hc.js'
import summarybutton from '@/components/delements/summarybutton/index.vue'
import _ from 'underscore';

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
                'rgba(248,95,29,0.5)',
                'rgba(248,95,29,1)',
                'rgba(248,95,29,0.5)'
            ],

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
                    value : 1,
                    text : 'labels.1year'
                }
            ],

            stds : [
                {
                    value : 0.95,
                    text : 'labels.95std'
                }
            ],

            period : 1,
            current_std : 0.95
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

            var restr = {
                min_x: 0,
                max_x: 0,
                min_y: 0,
                max_y: 0
            };

            series.push({
	            name: 'Before SDR',
	            type: 'areaspline',
	            lineColor: this.colors[0],
	            fillColor: this.colors[0].replace(',1)', ',0.10)'),
	            data: []
	        });

	        series.push({
	            name: 'Standart Deviation Range',
	            type: 'areaspline',
	            color: this.colors[1],
	            lineColor: this.colors[1],
	            fillColor: this.colors[1].replace(',1)', ',0.30)'),
	            data: []
	        });

	        series.push({
	            name: 'After SDR',
	            type: 'areaspline',
	            lineColor: this.colors[2],
	            fillColor: this.colors[2].replace(',1)', ',0.10)'),
	            data: []
	        });

            var _ltr = this.deviation.longTermReturn * this.period;
		    var _std = this.deviation.standardDeviation * Math.sqrt(this.period);

            var stdm = this.current_std * _std

            _.each(this.deviation.points, (point, i) => {
                if (restr.min_x >= point.x) restr.min_x = point.x;
                if (restr.max_x <= point.x) restr.max_x = point.x;
                if (restr.min_y >= point.y) restr.min_y = point.y;
                if (restr.max_y <= point.y) restr.max_y = point.y;

                // Before STDV
        	    if (point.x < _ltr - stdm) series[0].data.push({ x: point.x, y: point.y });
                // After STDV
        	    if (point.x > _ltr + stdm) series[2].data.push({ x: point.x, y: point.y });
                // Center

                if (point.x > _ltr - stdm && point.x < _ltr + stdm) {

                    if (i > 0) {
                        var _pp = this.deviation.points[i - 1];

                        if (_pp.x < _ltr - stdm) {
                            // Calculate STDV point
                            var _y = _pp.y + (((point.y - _pp.y)/(point.x - _pp.x)) * ((_ltr - stdm) - _pp.x));
                            /*----------------------------------------------------*/
                            series[1].data.push({
                                x: _ltr - stdm,
                                y: _y,

                                dataLabels: {
                                    enabled: true,
                                    align: 'right',
                                },

                            });

                            /*----------------------------------------------------*/
                            series[0].data.push({ x: _ltr - stdm, y: _y, notTooltip: true });
                        }
                    }

                    /*----------------------------------------------------*/
                    var _pnt = { x: point.x, y: point.y, zIndex: 2 };

                    /*if (i >= this.deviation.points.length - 1) {

                        _pnt.dataLabels = { enabled: true, align: 'left' };
                        _pnt.datalabelvalue = _ltr + stdm;

                    }*/

                    series[1].data.push(_pnt);

                    /*----------------------------------------------------*/
                    if (i < this.deviation.points.length - 1) {

                        var _np = this.deviation.points[i + 1];

                        if (_np.x > _ltr + stdm) {
                            // Calculate STDV point
                            var _y = point.y + (((_np.y - point.y)/(_np.x - point.x))*((_ltr + stdm) - point.x));
                            /*----------------------------------------------------*/
                            series[1].data.push({
                                x: _ltr + stdm,
                                y: _y,
                                dataLabels: {
                                    enabled: true,
                                    align: 'left',
                                },
                            });

                            /*----------------------------------------------------*/
                            series[2].data.push({ x: _ltr + stdm, y: _y, notTooltip: true });
                        }
                    }
                }

            })

            return series
        },

        chartOptions: function(){

            var d = options()

                d.chart.height = 400
                d.chart.plotBorderWidth = null
			    d.chart.type = 'areaspline'
                d.chart.spacing = [0,0,0,0]
                d.legend.enabled = false
                d.plotOptions.areaspline.dataLabels.style || (d.plotOptions.areaspline.dataLabels.style = {});
                d.plotOptions.areaspline.dataLabels.style.textOutline = false
                d.plotOptions.areaspline.animation = false;
                d.plotOptions.areaspline.allowPointSelect = false;
                d.plotOptions.areaspline.lineWidth = 1;
                d.plotOptions.column.borderWidth = 0

			    d.plotOptions.series.marker.enabled = false;

                d.title = { text: (''), style: { color: "#000000", fontSize : 12  + 'px' } }
               
                d.series = this.series
                d.yAxis[0].labels.enabled = false
                d.yAxis[0].gridLineWidth = 0
                d.yAxis[0].offset = 0
                

                console.log("D",d)

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
        },

        changeperiod : function(e){
            this.period = e.target.value
        },

        changestd : function(){

        }
    },
}