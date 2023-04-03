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

    created : () => {

    },

    watch: {
        composedPortfolios : {
            handler : function(){
                this.gettests()
            },
            deep : true,
            immediate : true
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
            return new Retrospective(this.underlying)
        },

        factors : function(){
            return this.retrospective.factors
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
        getterms : function(){
            var result = {}
            return Promise.all(_.map(this.composedPortfolios, (p) => {

                console.log("PPP", p)
                
                return this.core.pct.calcterm(p.positions).then((t) => {
                    result[p.id] = t

                    return Promise.resolve()
                })

            })).then(() => {

                console.log("TEPMMP", result)

                return Promise.resolve(result)
            })
        },
        gettests : function(){

            this.loading = true

            
                
            

            return this.core.pct.customtestStressTestsScenariosFromFactors(this.composedPortfolios, this.factors).then((data) => {

                return this.core.pct.ltrdetailsByAssets(this.composedPortfolios).then((ltrdata) => {

                    return this.getterms().then((terms) => {

                        console.log('ltrdata', ltrdata)

                        this.historyRaw = data
                        this.ltrdata = ltrdata
                        this.terms = terms

                        return Promise.resolve(data)

                    })


                })


            }).finally(() => {
                this.loading = false
            })
        },
    },
}