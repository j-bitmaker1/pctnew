import { mapState } from 'vuex';
import Retrospective from '@/application/lib/pct/retrospective';
import { RetrospectiveHistory } from '@/application/charts/index';

var chartRetrospectiveHistory = new RetrospectiveHistory()
import {Chart} from 'highcharts-vue'
import slider from '@/components/assets/slider/index.vue'
export default {
    name: 'portfolio_retrospective',
    props: {
        portfolio : Object,
        portfolios : Array,
        disable : Boolean
    },

    data : function(){

        return {
            loading : false,
            underlying : 'spy',
            historyRaw : {},
            ltrdata : [],
            terms : {},
            range : [2010, new Date().getFullYear()],
            
        }

    },

    components : {
        highcharts : Chart,
        slider
    },

    created (){
        this.getsettings()
    },

    watch: {
        composedPortfolios : {
            handler : function(){
                this.gettests()
            },
            deep : true,
            immediate : true
        },

        range : function(){
            this.savesettings()
        }
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        composedPortfolios() {

            return [].concat((this.portfolio ? [this.portfolio] : []), (this.portfolios || []))
        },

        composedPositions(){
            return _.reduce(this.composedPortfolios, (m, p) => {
                return m.concat(p.positions)
            }, [])
        },

        options : function(){
            var o = {height : 500}

            return o
        },

        retrospective : function(){
            return new Retrospective(this.underlying, this.core)
        },

        

        history : function(){

            return this.retrospective.prepareHistory(this.composedPortfolios, this.historyRaw, this.range, this.ltrdata, this.terms, (asset, portfolio) => {
                return portfolio.advisorFee || 0
            })
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
                portfolios : this.composedPortfolios,
                history : this.history,
                factorsLine : this.retrospective.factorsLine(this.range),
                terms : this.terms
            }, {
				...this.options
			})

			return d
		},
    }),

    methods : {
        getsettings : function(){
            return this.core.getsettings("RETROSPECTIVE", 'common').then(s => {

                if(s) this.range = s
            })
        },
        savesettings : function(){
            this.core.setsettings("RETROSPECTIVE", 'common', this.range).then(s => {

            })
        },
      
        gettests : function(){

            this.loading = true

            return this.retrospective.get(this.composedPortfolios).then(({historyRaw, ltrdata, terms}) => {

                this.historyRaw = historyRaw
                this.ltrdata = ltrdata
                this.terms = terms

            }).finally(() => {
                this.loading = false
            })

        },
    },
}