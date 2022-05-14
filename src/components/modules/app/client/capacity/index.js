import { mapState } from 'vuex';
import {Chart} from 'highcharts-vue'

import options from '@/application/hc.js'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

var plotLines = {

    capacity : {
        y : function(terminalValue, options){

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
    }
}

var series = {
       
    simulationAreaSplines : function(portfolios, terminalValue, options){

        portfolios = _.shuffle(portfolios)

        var glseries = [];
        
        glseries = glseries.concat(glseries, series.simulation(portfolios, options))
        glseries = glseries.concat(glseries, series.simulationSplines(portfolios, terminalValue, options))

        
        return glseries;
    },

    simulationSplines : function(portfolios, termValue, options){
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
    },

    simulation : function(portfolios, options){
    
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
    },
}

export default {
    name: 'client_capacity',
    props: {
    },

    components : {
        highcharts : Chart,
        VueSlider
    },

    data : function(){

        return {
            loading : false,
            simulation : {},

            values : {
                'ages': [20, 40],
                'savings' : 10000,
                'save' : 0,
                'salary' : 20000,

                //// extra

                'savemoreRange' : [20, 40],
                'withdrawRange' : [20, 40],
                'withdraw' : 0
                
            },

            

        }

    },

    created : function(){
        this.make()
    },

    watch: {
        options : function(){
            this.make()
        },
        extra : function(){
            this.make()
        }
    },
    computed: mapState({
        auth : state => state.auth,

        sliders : function(){
            return {
                'ages' : {
                    text : "Age Horizon",
                    
                    mode : '',

                    options : {
                        min : 18,
                        max : 99,
                        interval : 1,
                        maxRange : 50,
                        type : [Number, Number],
                    }
                },

                'savings' : {
                    text : "Initial Investment",
                    
                    mode : 'd',

                    options : {
                        min : 1000,
                        max : 10000000,
                        interval : 1000,
                        type : Number,
                    }
                },

                'save' : {
                    text : "Yearly Savings",
                    
                    mode : 'd',

                    options : {
                        min : 1000,
                        max : 100000,
                        interval : 1000,
                        type : Number,
                    }
                },

                'salary' : {
                    text : "Terminal Value",
                    mode : 'd',
                    options : {
                        min : 1000,
                        max : 100000,
                        interval : 1000,
                        type : Number,
                    }
                }, 

                'withdraw' : {
                    text : "Withdraw",
                    
                    mode : 'd',

                    options : {
                        min : 1000,
                        max : 100000,
                        interval : 1000,
                        type : Number,
                    }
                },

                'savemoreRange' : {
                    text : "Saving Horizon",
                    
                    mode : '',

                    options : {
                        min : this.values.ages[0],
                        max : this.values.ages[1],
                        interval : 1,
                        maxRange : 50,
                        type : [Number, Number],
                    }
                },

                'withdrawRange' : {
                    text : "Withdrawal Horizon",
                    
                    mode : '',

                    options : {
                        min : this.values.ages[0],
                        max : this.values.ages[1],
                        interval : 1,
                        maxRange : 50,
                        type : [Number, Number],
                    }
                },
            }
        },

        options : function(){
            return {
                age : this.values.ages[0],
                retire : this.values.ages[1],
                savings : this.values.savings,
                save : this.values.save,
                withdraw : this.values.withdraw,
                salary : this.values.salary //terminal value
            }
        },

        extra : function(){
            return {
                savemoreRange1 : this.values.savemoreRange[0],
                savemoreRange2 : this.values.savemoreRange[1],
                withdrawRange1 : this.values.withdrawRange[0],
                withdrawRange2 : this.values.withdrawRange[1],
                withdraw : this.values.withdraw
            }
        },

        chartOptions: function(){

            var d = options()

            d.chart.spacing = [0,0,0,0]
            d.chart.height = 400
            d.tooltip.enabled = false
            
            d.xAxis.min = this.options.age;
            d.xAxis.max = this.options.retire;

            d.yAxis[0].labels.enabled = false
            //d.yAxis[0].plotLines = plotLines.capacity.y(this.simulation.terminalValue, this.options)
            /*d.yAxis[0].min = this.options.savings * 0.66;*/
            d.yAxis[0].endOnTick = false
            d.yAxis[0].gridLineWidth = 0
            d.yAxis[0].offset = 0
            d.legend.enabled = false

            d.plotOptions.spline.marker = {enabled : false}
            
            d.series = series.simulationAreaSplines(
                this.simulation.portfolios, this.simulation.terminalValue, this.options
            ); 


            return d
        },

       
    }),

    methods : {
        make : function(){
            this.calculate()
        },

        calculate : function(){
            var capacity = new this.core.pct.capacity({
                options : this.options,
                extra : this.extra
            })

            this.simulation = capacity.simulation()
            console.log('this.options', this.options)
            console.log('this.extra', this.extra)
            console.log('this.simulation', this.simulation)
        }
    },
}