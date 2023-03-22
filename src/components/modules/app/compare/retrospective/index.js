import { mapState } from 'vuex';

import Retrospective from '@/application/lib/pct/retrospective';
import { RetrospectiveHistory } from '@/application/charts/index';

var chartRetrospectiveHistory = new RetrospectiveHistory()
import {Chart} from 'highcharts-vue'
import slider from '@/components/assets/slider/index.vue'

export default {
    name: 'compare_retrospective',
    props: {
        ids : Array
    },

    components : {
        highcharts : Chart,
        slider
        
    },

    data : function(){

        return {
            loading : false,
            portfolios : [],
            underlying : 'spy',
            historyRaw : {},

            range : [2010, new Date().getFullYear()]
        }

    },

    created (){
        this.load()
    },

    watch: {
        ids : {
            immediate : true,
            handler : function(){
                this.load()
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,

        options : function(){
            var o = {height : 500}

            return o
        },

        retrospective : function(){
            return new Retrospective(this.underlying)
        },

        factors : function(){
            return this.retrospective.factors
        },

        history : function(){

            return this.retrospective.prepareHistory(this.portfolios, this.historyRaw, this.range)
        },

        chartdata : function(){
			return allocation.chartData(this.grouped, this.colors)
		},

        sliderOptions : function(){

			return {
				min : 1927,
				max : new Date().getFullYear(),
				interval : 1,
				type : Number,
			}
		},

		chartOptions: function(){

			var d = chartRetrospectiveHistory.chartOptions({
                portfolios : this.portfolios,
                history : this.history,
                factorsLine : this.retrospective.factorsLine(this.range)
            }, {
				...this.options
			})

			return d
		},

    }),

    methods : {
        changeperiod : function(e){
			this.period = Number(e.target.value)
		},

		changestd : function(e){
			this.current_std = Number(e.target.value)
		},

        load : function(){

            this.loading = true

            this.core.api.pctapi.portfolios.gets(this.ids).then(r => {

                this.portfolios = r

                console.log("HERE")

                return this.gettests()
                
            }).catch(e => {
                console.error(e)
            }).finally(() => {
                this.loading = false
            })
            
        },

        gettests : function(){

            return this.core.pct.customtestStressTestsScenariosFromFactors(this.portfolios, this.factors).then((data) => {
                this.historyRaw = data

                //this.history = this.retrospective.prepareHistory(this.portfolios, data)

                console.log('this.history', this.history, data)

                

                return Promise.resolve(data)
            })
        },

        selectone : function(id){
            this.$emit('selectone', id)
        },

        removeitem : function(id){
            this.$emit('removeitem', id)
        }

        
    },
}