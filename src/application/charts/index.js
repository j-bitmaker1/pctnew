import options from './hc.js'

import f from '@/application/shared/functions.js'
import _ from 'underscore'

class Distribution {

    colors = [
        'rgba(248,95,29,0.5)',
        'rgba(248,95,29,1)',
        'rgba(248,95,29,0.5)'
    ]

    stds = function(){
        return [
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
        ]
    }

    periods = function(){
        return [
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
        ]
    }

    constructor(){
     
    }

    series = function({
        total, locale,
        deviation,
        period,
        current_std
    }, p = {}){

        p.mode || (p.mode = 'd')

        var series = [];
        //var total = this.portfolio.total() 
        //var locale = this.core.user.locale

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

        var _ltr = deviation.longTermReturn * period;
        var _std = deviation.standardDeviation * Math.sqrt(period);

        var stdm = current_std * _std

        _.each(deviation.points, (point, i) => {
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
                    var _pp = deviation.points[i - 1];

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

                                formatter : function(){


                                    var v = (_ltr - stdm) * total / 100

                                    return f.values.format(locale, p.mode, v)
                                }
                            },

                        });

                        /*----------------------------------------------------*/
                        series[0].data.push({ x: _ltr - stdm, y: _y, notTooltip: true });
                    }
                }

                /*----------------------------------------------------*/
                var _pnt = { x: point.x, y: point.y, zIndex: 2 };

                /*if (i >= deviation.points.length - 1) {

                    _pnt.dataLabels = { enabled: true, align: 'left' };
                    _pnt.datalabelvalue = _ltr + stdm;

                }*/

                series[1].data.push(_pnt);

                /*----------------------------------------------------*/
                if (i < deviation.points.length - 1) {

                    var _np =deviation.points[i + 1];

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

                                formatter : function(){

                                    var v = (_ltr + stdm) * total / 100

                                    return f.values.format(locale, p.mode, v)
                                }
                            },
                        });

                        /*----------------------------------------------------*/
                        series[2].data.push({ x: _ltr + stdm, y: _y, notTooltip: true });
                    }
                }
            }

        })

        return series
    }

    chartOptions = function(series, p = {}){

        var d = options(p)

            d.chart.height = p.height || 400

            if(p.width) d.chart.width = p.width

            d.chart.plotBorderWidth = null
            d.chart.type = 'areaspline'
            d.chart.spacing = [0,0,0,0]
            d.legend.enabled = false
            d.plotOptions.areaspline.dataLabels.style || (d.plotOptions.areaspline.dataLabels.style = {});
            d.plotOptions.areaspline.dataLabels.style.textOutline = false
            d.plotOptions.areaspline.animation = false;
            d.plotOptions.areaspline.allowPointSelect = false;
            d.plotOptions.areaspline.lineWidth = p.print ? 4 : 1;
            d.plotOptions.column.borderWidth = 0

            d.plotOptions.series.marker.enabled = false;

            d.title = { text: (''), style: { color: "#000000", fontSize : p.print ? 48 : 12  + 'px' } }
           
            d.series = series
            d.yAxis[0].labels.enabled = false
            d.yAxis[0].gridLineWidth = 0
            d.yAxis[0].offset = 0

            if(typeof p.xmax != 'undefined') {d.xAxis.max = p.xmax}
            if(typeof p.xmin != 'undefined') {d.xAxis.min = p.xmin}

            if(typeof p.ymax != 'undefined') {d.yAxis[0].max = p.ymax}
            if(typeof p.ymin != 'undefined') {d.yAxis[0].min = p.ymin}
            
        return d
    }
}

class Allocation {

    chartcolors = ['#F2994A', '#9B51E0', '#219653', '#2F80ED', '#56CCF2', '#BB6BD9', '#EB5757']

    groups = function(){
        return [
            {
                text : 'labels.bygroup',
                id : 'type'
            },

            {
                text : 'labels.bysector',
                id : 'sector'
            }
        ]
    }

    constructor(){
     
    }

    colorbyindex = function(i){
        return this.chartcolors[i % this.chartcolors.length]
    }

    chartData(grouped, colors){
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
        
        _.each(grouped, (g, i) => {
            var point = {}

            point.name = i
            point.drilldown = i
            point.color = colors ? colors[i] || this.colorbyindex(c) : this.colorbyindex(c)

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
    }

    chartOptions(chartdata, p = {}){

        var d = options(p)

            d.chart.height = p.height || 400

            if(p.width) d.chart.width = p.width

            d.chart.type = 'pie'
            d.legend.enabled = false
            d.title = { text: (''), style: { color: "#000000", fontSize : p.print ? 48 : 12  + 'px' } }
            d.plotOptions.pie.showInLegend = false
            d.plotOptions.pie.animation = true
            d.plotOptions.pie.allowPointSelect = false
            d.plotOptions.pie.size = '90%'
            d.plotOptions.pie.colorByPoint = true

            d.series = [chartdata.serie]

            if(!p.print)
                d.drilldown = chartdata.drilldown

            /*d.chart.events = {}
            d.chart.events.drilldown = this.drilldownevent
            d.chart.events.drillup = this.drillup*/
            
        return d

    }

}

class MonteCarlo {
    constructor(){

    }

    defaultValues = function(){
        return {
            'ages': [20, 40],
            'savings' : 10000,
            'save' : 0,
            'salary' : 200000,

            //// extra

            'savemoreRange' : [20, 40],
            'withdrawRange' : [20, 40],
            'withdraw' : 0
            
        }
    }

    plotLines = function(terminalValue, options){

        var sr = 1;

        var v = terminalValue

        var textColor = "rgb(55, 55, 54)";

        var plotLines = [{
            color: textColor,
            dashStyle: 'solid',
            width: 1 * sr,
            value: v,
            label: {
                x: -15 * sr,
                y : -15 * sr,
                style : {
                    "font-weight" : "700",
                    "font-size" : (14 * sr) + "px",
                    "color" : textColor
                },
                align : 'right',
                text: "Terminal value: " + v
            },
            zIndex: 30
        },{
            color: textColor,
            dashStyle: 'solid',
            width: 1 * sr,
            value: options.savings,
            label: {
                x: 15 * sr,
                y : -15 * sr,
                style : {
                    "font-weight" : "700",
                    "font-size" : (14 * sr) + "px",
                    "color" : textColor
                },
                align : 'left',
                text: "Initial Investement: " + options.savings
            },
            zIndex: 30
        }]

        return plotLines;
	}

    simulationAreaSplines = function(portfolios, terminalValue, options){

		portfolios = _.shuffle(portfolios)

		var glseries = [];
		
		glseries = glseries.concat(glseries, this.simulation(portfolios, options))
		glseries = glseries.concat(glseries, this.simulationSplines(portfolios, terminalValue, options))

		
		return glseries;
	}

	simulationSplines = function(portfolios, termValue, options){
		var series = [];


		_.each(portfolios, function(portfolio, j){


			var r = ((j < 100 || j > portfolios.length - 100) && j % 10 == 0) || ((j >= 100 && j <= portfolios.length - 100) && j % 100 == 0)

		
			if (r){

				var beginYear = options.age;
				var lastYear = options.retire;

				var serie =  {
					name: 'Portfolio Range',
					color : "rgba(0, 160, 0, 0.5)",
					data: [],
					type : 'spline',
					showInLegend: false
				}

				if(portfolio[portfolio.length - 1] < termValue){
					serie.color = "rgba(220, 0, 40, 0.4)"
				}
				

				series.push(serie)

				for(var y = beginYear; y <= lastYear; y++){

					var i = y - beginYear;

					serie.data.push({
						x : y,
						y : portfolio[i]
					})

				}
			}

			
		})

		return series;
	}

	simulation = function(portfolios, options){
	
		var serie = {
			name: 'Portfolio Range',
			color : '#939393',
			data: [],
			type : 'areasplinerange',
			fillOpacity : 0.1
		}

		var series = [serie];

		var beginYear = options.age;
		var lastYear = options.retire;

		var l = portfolios.length

		for(var y = beginYear; y <= lastYear; y++){

			var i = y - beginYear;


			var low = undefined;
			var high = undefined;

			for(var j = 0; j < l; j++){

				if (j % 100 == 0){

					var p = portfolios[j];


					if(typeof low == 'undefined' || low > p[i]){
						low = p[i]
					}

					if(typeof high == 'undefined' || high < p[i]){
						high = p[i]
					}

				}

			}

			serie.data[i] = {
				low : low,
				high : high,
				x : y
			}

		}

		return series
	}

    chartOptions = function({
        
        simulation,
        dataoptions
    }, p = {}){

        var d = options(p)

        d.chart.spacing = [0,0,0,0]
        d.chart.height = p.height || 400

        if(p.width) d.chart.width = p.width

        d.tooltip.enabled = false
        
        d.xAxis.min = dataoptions.age;
        d.xAxis.max = dataoptions.retire;

        d.yAxis[0].labels.enabled = false
        d.yAxis[0].endOnTick = false
        d.yAxis[0].gridLineWidth = 0
        d.yAxis[0].offset = 0
        d.legend.enabled = false

        d.plotOptions.spline.marker = {enabled : false}
        
        d.series = this.simulationAreaSplines(
            simulation.portfolios, simulation.terminalValue, dataoptions
        ); 


        return d
    }
    
}

export {
    Allocation,
    Distribution,
    MonteCarlo
}