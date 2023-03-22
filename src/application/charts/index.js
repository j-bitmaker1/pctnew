import options from './hc.js'

import f from '@/application/shared/functions.js'
import _ from 'underscore'

import Highcharts from '@/application/assets/hc.js'

class Distribution {

    colors = [
        'rgba(248,95,29,0.5)',
        'rgba(248,95,29,1)',
        'rgba(248,95,29,0.5)'
    ]

    stds = function () {
        return [
            {
                value: 1,
                text: 'labels.68std'
            },
            {
                value: 2,
                text: 'labels.95std'
            },
            {
                value: 3,
                text: 'labels.997std'
            }
        ]
    }

    periods = function () {
        return [
            {
                value: 0.25,
                text: 'labels.025year'
            },
            {
                value: 0.5,
                text: 'labels.05year'
            },
            {
                value: 1,
                text: 'labels.1year'
            },
            {
                value: 3,
                text: 'labels.3years'
            }
        ]
    }

    constructor() {

    }

    series = function ({
        total, locale,
        deviation,
        period,
        current_std
    }, p = {}) {

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
            name: 'Standard Deviation Range',
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
                        var _y = _pp.y + (((point.y - _pp.y) / (point.x - _pp.x)) * ((_ltr - stdm) - _pp.x));
                        /*----------------------------------------------------*/
                        series[1].data.push({
                            x: _ltr - stdm,
                            y: _y,

                            dataLabels: {
                                enabled: true,
                                align: 'right',

                                formatter: function () {


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

                    var _np = deviation.points[i + 1];

                    if (_np.x > _ltr + stdm) {
                        // Calculate STDV point
                        var _y = point.y + (((_np.y - point.y) / (_np.x - point.x)) * ((_ltr + stdm) - point.x));
                        /*----------------------------------------------------*/
                        series[1].data.push({
                            x: _ltr + stdm,
                            y: _y,
                            dataLabels: {
                                enabled: true,
                                align: 'left',

                                formatter: function () {

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

    chartOptions = function (series, p = {}) {

        var d = options(p)

        d.chart.height = p.height || 400

        if (p.width) d.chart.width = p.width

        d.chart.plotBorderWidth = null
        d.chart.type = 'areaspline'
        d.chart.spacing = [0, 0, 0, 0]
        d.legend.enabled = false
        d.plotOptions.areaspline.dataLabels.style || (d.plotOptions.areaspline.dataLabels.style = {});
        d.plotOptions.areaspline.dataLabels.style.textOutline = false
        d.plotOptions.areaspline.animation = false;
        d.plotOptions.areaspline.allowPointSelect = false;
        d.plotOptions.areaspline.lineWidth = p.print ? 4 : 1;
        d.plotOptions.column.borderWidth = 0

        d.plotOptions.series.marker.enabled = false;

        d.title = { text: (''), style: { color: "#000000", fontSize: p.print ? 48 : 12 + 'px' } }

        d.series = series
        d.yAxis[0].labels.enabled = false
        d.yAxis[0].gridLineWidth = 0
        d.yAxis[0].offset = 0

        if (typeof p.xmax != 'undefined') { d.xAxis.max = p.xmax }
        if (typeof p.xmin != 'undefined') { d.xAxis.min = p.xmin }

        if (typeof p.ymax != 'undefined') { d.yAxis[0].max = p.ymax }
        if (typeof p.ymin != 'undefined') { d.yAxis[0].min = p.ymin }

        return d
    }
}

class Allocation {

    chartcolors = ['#F2994A', '#9B51E0', '#219653', '#2F80ED', '#56CCF2', '#BB6BD9', '#EB5757']

    groups = function () {
        return [
            {
                text: 'labels.bygroup',
                id: 'group'
            },

            {
                text: 'labels.bysector',
                id: 'sector'
            }
        ]
    }

    constructor() {

    }

    colorbyindex = function (i) {
        return this.chartcolors[i % this.chartcolors.length]
    }

    chartData(grouped, colors) {
        var serie = {
            minPointSize: 10,
            innerSize: '80%',
            name: "Portfolio Weight",
            data: [],
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
                name: i,
                id: i,
                minPointSize: 10,
                size: '100%',
                innerSize: '80%',
                colorByPoint: true,
                data: [],
            }

            _.each(g, (asset, i) => {

                var point = {
                    name: asset.ticker,
                    y: asset.value,
                    color: this.colorbyindex(i)
                }

                drilldownserie.data.push(point)
            })

            drilldown.push(drilldownserie)
        })

        return {
            serie,
            drilldown: {
                series: drilldown
            }
        }
    }

    chartOptions(chartdata, p = {}) {

        var d = options(p)

        d.chart.height = p.height || 400

        if (p.width) d.chart.width = p.width

        d.chart.type = 'pie'
        d.legend.enabled = false
        d.title = { text: (''), style: { color: "#000000", fontSize: p.print ? 48 : 12 + 'px' } }
        d.plotOptions.pie.showInLegend = false
        d.plotOptions.pie.animation = true
        d.plotOptions.pie.allowPointSelect = false
        d.plotOptions.pie.size = '90%'
        d.plotOptions.pie.colorByPoint = true

        d.series = [chartdata.serie]

        if (!p.print)
            d.drilldown = chartdata.drilldown

        /*d.chart.events = {}
        d.chart.events.drilldown = this.drilldownevent
        d.chart.events.drillup = this.drillup*/

        return d

    }

}

class MonteCarlo {
    constructor() {

    }

    defaultValues = function () {
        return {
            'ages': [20, 40],
            'savings': 10000,
            'save': 0,
            'salary': 200000,

            //// extra

            'savemoreRange': [20, 40],
            'withdrawRange': [20, 40],
            'withdraw': 0

        }
    }

    plotLines = function (terminalValue, options) {

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
                y: -15 * sr,
                style: {
                    "font-weight": "700",
                    "font-size": (14 * sr) + "px",
                    "color": textColor
                },
                align: 'right',
                text: "Terminal value: " + v
            },
            zIndex: 30
        }, {
            color: textColor,
            dashStyle: 'solid',
            width: 1 * sr,
            value: options.savings,
            label: {
                x: 15 * sr,
                y: -15 * sr,
                style: {
                    "font-weight": "700",
                    "font-size": (14 * sr) + "px",
                    "color": textColor
                },
                align: 'left',
                text: "Initial Investement: " + options.savings
            },
            zIndex: 30
        }]

        return plotLines;
    }

    simulationAreaSplines = function (portfolios, terminalValue, options) {

        portfolios = _.shuffle(portfolios)

        var glseries = [];

        glseries = glseries.concat(glseries, this.simulation(portfolios, options))
        glseries = glseries.concat(glseries, this.simulationSplines(portfolios, terminalValue, options))


        return glseries;
    }

    simulationSplines = function (portfolios, termValue, options) {
        var series = [];


        _.each(portfolios, function (portfolio, j) {


            var r = ((j < 100 || j > portfolios.length - 100) && j % 10 == 0) || ((j >= 100 && j <= portfolios.length - 100) && j % 100 == 0)


            if (r) {

                var beginYear = options.age;
                var lastYear = options.retire;

                var serie = {
                    name: 'Portfolio Range',
                    color: "rgba(0, 160, 0, 0.5)",
                    data: [],
                    type: 'spline',
                    showInLegend: false
                }

                if (portfolio[portfolio.length - 1] < termValue) {
                    serie.color = "rgba(220, 0, 40, 0.4)"
                }


                series.push(serie)

                for (var y = beginYear; y <= lastYear; y++) {

                    var i = y - beginYear;

                    serie.data.push({
                        x: y,
                        y: portfolio[i]
                    })

                }
            }


        })

        return series;
    }

    simulation = function (portfolios, options) {

        var serie = {
            name: 'Portfolio Range',
            color: '#939393',
            data: [],
            type: 'areasplinerange',
            fillOpacity: 0.1
        }

        var series = [serie];

        var beginYear = options.age;
        var lastYear = options.retire;

        var l = portfolios.length

        for (var y = beginYear; y <= lastYear; y++) {

            var i = y - beginYear;


            var low = undefined;
            var high = undefined;

            for (var j = 0; j < l; j++) {

                if (j % 100 == 0) {

                    var p = portfolios[j];


                    if (typeof low == 'undefined' || low > p[i]) {
                        low = p[i]
                    }

                    if (typeof high == 'undefined' || high < p[i]) {
                        high = p[i]
                    }

                }

            }

            serie.data[i] = {
                low: low,
                high: high,
                x: y
            }

        }

        return series
    }

    chartOptions = function ({

        simulation,
        dataoptions
    }, p = {}) {

        var d = options(p)

        d.chart.spacing = [0, 0, 0, 0]
        d.chart.height = p.height || 400

        if (p.width) d.chart.width = p.width

        d.tooltip.enabled = false

        d.xAxis.min = dataoptions.age;
        d.xAxis.max = dataoptions.retire;

        d.yAxis[0].labels.enabled = false
        d.yAxis[0].endOnTick = false
        d.yAxis[0].gridLineWidth = 0
        d.yAxis[0].offset = 0
        d.legend.enabled = false


        d.yAxis[0].plotLines = this.plotLines(simulation.terminalValue, dataoptions)

        ///

        d.plotOptions.spline.marker = { enabled: false }

        d.series = this.simulationAreaSplines(
            simulation.portfolios, simulation.terminalValue, dataoptions
        );


        return d
    }

}

class RetrospectiveHistory {
    constructor() {

    }

    chartcolors = ['#F2994A', '#9B51E0', '#219653', '#2F80ED', '#56CCF2', '#BB6BD9', '#EB5757']

    series = function(portfolios, history, factorsLine){
        var series = []

        var maxportfolio = 0
        var maxindex = 0


        _.each(portfolios, (portfolio) => {
            var serie = {
                name: portfolio.name,
                color: this.colorbyindex(series.length),
                data: [],
                type: 'spline',
            }

            _.each(history[portfolio.id], (yd) => {
                serie.data.push({
                    x: yd.year,
                    y: yd.total * 100
                })

                if(yd.total > maxportfolio) maxportfolio = yd.total
            })

            series.push(serie)
           
        })

        var serie = {
            name: factorsLine.name,
            color: 'rgb(33, 150, 83)',
            data: [],
            type: 'areasplinerange',
            fillOpacity: 0.1,
            
        }

        _.each(factorsLine.data, (yd) => {

            serie.data.push({
                low : 0,
                high : yd.total * 100,
                x: yd.year,
            })

            if(yd.total > maxindex) maxindex = yd.total


            
        })

        //if(maxportfolio > maxindex * 10) serie.yAxis = 1

        //serie.yAxis = 1

        series.push(serie)

        return series
    }


 
    colorbyindex = function (i) {
        return this.chartcolors[i % this.chartcolors.length]
    }


    chartOptions = function ({
        portfolios,
        history,
        factorsLine
    }, p = {}) {

        var series = this.series(
            portfolios,
            history,
            factorsLine
        );

        p.yAxisMultiple = _.find(series, (serie) => {
            return serie.yAxis
        }) ? true : false

        console.log('p.yAxisMultiple', p.yAxisMultiple, series)

        var d = options(p)

        d.chart.spacing = [0, 0, 0, 0]
        d.chart.height = p.height || 400

        if (p.width) d.chart.width = p.width

        d.tooltip.enabled = false

        d.xAxis.min = factorsLine.data[0].year// history[0].year;
        d.xAxis.max = factorsLine.data[factorsLine.data.length - 1].year //history[history.length - 1].year;

        d.yAxis[0].endOnTick = false
        d.yAxis[0].gridLineWidth = 1
        d.yAxis[0].offset = 0

        if (p.yAxisMultiple){
            d.yAxis[1].endOnTick = false
            d.yAxis[1].gridLineWidth = 0
            d.yAxis[1].offset = 0
            d.yAxis[1].opposite = false
        }
        


        d.xAxis.gridLineWidth = 1

        d.chart.rangeSelector = {
            floating: true,
            y: 10
        },


        d.series = series

        return d
    }

}

class CampaignsOld {

    chartcolors = ['#F2994A', '#9B51E0']

    constructor() {

    }

    renderIcons() {

        // Move icon
        if (!this.series[0].icon) {
            this.series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
                .attr({
                    stroke: '#303030',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'stroke-width': 2,
                    zIndex: 10
                })
                .add(this.series[2].group);
        }
        this.series[0].icon.translate(
            this.chartWidth / 2 - 10,
            this.plotHeight / 2 - this.series[0].points[0].shapeArgs.innerR -
            (this.series[0].points[0].shapeArgs.r - this.series[0].points[0].shapeArgs.innerR) / 2
        );

        // Exercise icon
        if (!this.series[1].icon) {
            this.series[1].icon = this.renderer.path(
                ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8, 'M', 8, -8, 'L', 16, 0, 8, 8]
            )
                .attr({
                    stroke: '#ffffff',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'stroke-width': 2,
                    zIndex: 10
                })
                .add(this.series[2].group);
        }

        this.series[1].icon.translate(
            this.chartWidth / 2 - 10,
            this.plotHeight / 2 - this.series[1].points[0].shapeArgs.innerR -
            (this.series[1].points[0].shapeArgs.r - this.series[1].points[0].shapeArgs.innerR) / 2
        );

        // Stand icon
        if (!this.series[2].icon) {
            this.series[2].icon = this.renderer.path(
                ['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
                .attr({
                    stroke: '#303030',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'stroke-width': 2,
                    zIndex: 10
                })
                .add(this.series[2].group);
        }

        this.series[2].icon.translate(
            this.chartWidth / 2 - 10,
            this.plotHeight / 2 - this.series[2].points[0].shapeArgs.innerR -
                (this.series[2].points[0].shapeArgs.r - this.series[2].points[0].shapeArgs.innerR) / 2
        );

    }

    chartOptions({
        batchProgress = 0,
        emails = 0,
        current = 0
    }, p = {}) {

        var dod = options(p)

        dod.chart = {
            ...dod.chart,
            ...{
                type: 'solidgauge',
                height: '110%',
                events: {
                    render: this.renderIcons
                }
            }
        }

        dod.tooltip = {
            ...{
                borderWidth: 0,
                backgroundColor: 'none',
                shadow: false,
                style: {
                    fontSize: '16px',
                    textAlign: 'center'
                },
                valueSuffix: '%',
                pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                positioner: function (labelWidth) {
                    return {
                        x: (this.chart.chartWidth - labelWidth) / 2,
                        y: (this.chart.plotHeight / 2) - 25
                    };
                }
            }
        }

        dod.pane = {
            startAngle: 0,
            endAngle: 360,
            background: [{ // Track for Move
                outerRadius: '112%',
                innerRadius: '88%',
                backgroundColor: Highcharts.color(this.chartcolors[0])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }, { // Track for Exercise
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.color(this.chartcolors[1])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }]
        }

        dod.yAxis = {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        }

        dod.plotOptions = {
            solidgauge: {
                dataLabels: {
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: true
            }
        }

        dod.series = [{
            name: 'Batch campaign progress',
            data: [{
                color: Highcharts.color(this.chartcolors[0]).get(),
                radius: '112%',
                innerRadius: '88%',
                y: batchProgress
            }]
        }, {
            name: 'Current campaign',
            data: [{
                color: Highcharts.color(this.chartcolors[1]).get(),
                radius: '87%',
                innerRadius: '63%',
                y: current
            }]
        }, {
            name: 'Opened emails',
            data: [{
                color: Highcharts.getOptions().colors[2],
                radius: '62%',
                innerRadius: '38%',
                y: emails
            }]
        }]

        delete dod.xAxis
        delete dod.legend


        return dod

    }

}

class Campaigns {

    chartcolors = ['#F2994A', '#9B51E0', '#219653', '#2F80ED', '#56CCF2', '#BB6BD9', '#EB5757']

    constructor() {

    }

    colorbyindex = function (i) {
        return this.chartcolors[i % this.chartcolors.length]
    }

    chartData(points) {

        var serie = {
            minPointSize: 10,
            innerSize: '80%',
            name: "Campaigns",
            data: [],
            colorByPoint: true,
            size: '75%'
        }

        var drilldown = []

        var c = 0

        _.each(points,(p, i) => {
            var point = {}

            point.name = p.name
            point.color = p.color ? p.color : this.colorbyindex(c)

            point.y = p.value

            serie.data.push(point)

            c++
        })

        return {
            serie
        }
    }

    chartOptions(chartdata, p = {}) {

        var d = options(p)

        d.chart.height = p.height || 350

        if (p.width) d.chart.width = p.width

        d.chart.type = 'pie'
        d.legend.enabled = false
        d.title = { text: (''), style: { color: "#000000", fontSize: p.print ? 48 : 12 + 'px' } }
        d.plotOptions.pie.showInLegend = false
        d.plotOptions.pie.animation = true
        d.plotOptions.pie.allowPointSelect = false
        d.plotOptions.pie.size = '90%'
        d.plotOptions.pie.colorByPoint = true

        d.series = [chartdata.serie]

        return d

    }

}

export {
    Allocation,
    Distribution,
    MonteCarlo,
    Campaigns,
    RetrospectiveHistory
}