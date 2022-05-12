import { mapState } from 'vuex';
import {Chart} from 'highcharts-vue'

import options from '@/application/hc.js'

export default {
    name: 'allocation',
    props: {
    },

    data : function(){

        return {
            loading : false
        }

    },

    components : {
        highcharts : Chart
    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        chartOptions: function(){

            console.log('options', options)

            var d = options()

                d.chart.height = 400
                d.chart.type = 'pie'
                d.legend.enabled = false
                d.title = { text: (''), style: { color: "#000000", fontSize : 12  + 'px' } }
                d.plotOptions.pie.showInLegend = true
                d.plotOptions.pie.animation = true
                d.plotOptions.pie.allowPointSelect = false
                d.plotOptions.pie.size = '90%'
                d.plotOptions.pie.colorByPoint = true

                d.series = [{
                    name: "Portfolio Weight",
                    data: [{
                        y : 50,
                        name : '1'
                    },{
                        y : 50,
                        name : '2'
                    }],
                    size: '100%',
                }]

            console.log("D,", d)

            return d
        }

    }),

    methods : {
        
    },
}