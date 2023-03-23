import { mapState } from 'vuex';

export default {
    name: 'portfolio_crashtest_scenariodefinitions',
    props: {
        portfolios : Object,
        cts : Object
    },

    data : function(){

        return {
            loading : false,
            scenarios : []
        }

    },

    created (){
        console.log('this.cts, this.portfolios' , this.cts, this.portfolios)
    },

    watch: {
        scenarioIds : {
            immediate : true,
            handler : function(){
                this.load()
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,

        scenarioIds(){
            var ids = {}

            _.each(this.cts.scenarios, (s) => {
                ids[s.id] = s.id
            })

            return _.toArray(ids)
        },

        maxfactors(){
            var f = _.max(this.scenarios, (scenario) => {
                return scenario.factors ? scenario.factors.length : 0
            })

            if(f.factors) return f.factors.length

            return 0
        },

        rsall () {
            return {
                shocks : {
                    'vix' : 'VIX: Index is the at-the-money volatility of the options traded on the S&P 500. It indicates the volatility forecast opinion held by the traders.',
                    'corporatebbb other spread' : 'CorporateBBB Other Spread: The difference between the yield of the Corporate BBB index with average maturity of 10 years and the yield-to-maturity on a US Treasury zero coupon bond maturing in 10 years.',
                    'corporate bbb spreads' : 'CorporateBBB Other Spread: The difference between the yield of the Corporate BBB index with average maturity of 10 years and the yield-to-maturity on a US Treasury zero coupon bond maturing in 10 years.',
                    'russia' : 'Russia: Market weighted index of companies domiciled in Russia.',
                    'china' : 'China: Market weighted index of companies domiciled in China.',
                    's&p 500' : 'S&P 500: Standard & Poors 500 stock index.',
                    'peak-to-trough' : 'Peak-to-trough: Return is the biggest loss realized during a given stress scenario. There is no set timeframe over which peak-to-trough losses occur.',
                  
                },
                description : {
                    'peak-to-trough' : 'Peak-to-trough: Return is the biggest loss realized during a given stress scenario. There is no set timeframe over which peak-to-trough losses occur.',
                    'corporatebbb other spread' : 'CorporateBBB Other Spread: The difference between the yield of the Corporate BBB index with average maturity of 10 years and the yield-to-maturity on a US Treasury zero coupon bond maturing in 10 years.',
                    'vix' : 'VIX: Index is the at-the-money volatility of the options traded on the S&P 500. It indicates the volatility forecast opinion held by the traders.',
                    'corporate bbb spreads' : 'CorporateBBB Other Spread: The difference between the yield of the Corporate BBB index with average maturity of 10 years and the yield-to-maturity on a US Treasury zero coupon bond maturing in 10 years.',
                    'russia' : 'Russia: Market weighted index of companies domiciled in Russia.',
                    'china' : 'China: Market weighted index of companies domiciled in China.',
                    's&p 500' : 'S&P 500: Standard & Poors 500 stock index.',
                    
                },
                factors : {
                    '10 years us government curve' : '10 Years US Government Curve: Yield-to-maturity on a zero coupon US Treasury bond that matures in 10 years.',
                    'united states' : 'United States: Market weighted index of companies domiciled in United States.',
                    'dj us total stock market index' : 'DJ US Total Stock Market Index: Dow Jones index of all US stocks.',
                    'gold' : 'Gold: Gold futures price series from Chicago Mercantile Exchange.',
                    'hyccc' : 'HYCCC: Is the credit spread (yield difference with a Treasury of comparable maturity) on the Merrill Lynch CCC or lower-rated index. It signifies the willingness of investors to lend to risky companies and their estimation of their default rate. During risky environments these spreads widen immediately.',
                    'japan' : 'Japan: Market weighted index of companies domiciled in Japan.',
                    '30 years us government curve' : '30 Years US Government Curve: Yield-to-maturity on a zero coupon US Treasury bond that matures in 30 years.',
                    'eur' : 'EUR: Euro FX rate against the US Dollar.',
                    'generic 1st natural gas' : 'Generic 1st Natural Gas: Natural Gas futures price.',
                    'germany' : 'Germany: Market weighted index of companies domiciled in Germany.',
                    'oil' : 'Oil: Oil Brent Crude Price.',
                    'rub' : 'RUB: Russian Ruble FX rate against the US Dollar.',
                    'brazil' : 'Brazil: Market weighted index of companies domiciled in Brazil.',
                    'india' : 'India: Market weighted index of companies domiciled in India.',
                    'home equity aaa spread' : 'Home Equity AAA Spread: Is the credit spread (yield difference with treasury of comparable maturity) on the bond index that contains securitized mortgages. A widening (increase) in this spread is caused by decreasing housing prices.',
                    'us generic 10 year breakeven spread' : 'US Generic 10 year BreakEven Spread: Is the difference between the nominal yield on a fixed-rate investment and the real yield (fixed spread) on an inflation-linked investment of similar maturity and credit quality. It indicates inflation expectations as expressed by the traders who are trading government securities and inflation-linked instruments. In our convention when spreads narrow (decrease) – the inflation expectations are increasing.'
                }
            }
        },

        rs(){
            var rs = {
                shocks : {},
                description : {},
                factors : {}
            }

            var rsall = this.rsall

             

            _.each(this.scenarios, (scenario) => {

                _.each(rsall.description, (t, i) => {
                    if((scenario.description || "").toLowerCase().indexOf(i) > -1){
                        this.addre(rs, t, 'description', scenario.id)
                    }
                })

                _.each(rsall.shocks, (t, i) => {
                    if((scenario.shocks || "").toLowerCase().indexOf(i) > -1){
                        this.addre(rs, t, 'shocks', scenario.id)
                    }
                })

                _.each(rsall.factors, (t, i) => {
                    _.each(scenario.factors, (factor, j) => {

                        if((factor.name || "").toLowerCase().indexOf(i) > -1){
                            this.addre(rs, t, 'factors', scenario.id, j)
                        }
                    })
                    
                })
                
            })

            return rs
        },

        
    }),

    methods : {
        getre : function(types){

            var re = []

            _.each(types, (t) => {
                re = re.concat(_.toArray(this.rs[t]))
            })

            return _.sortBy(re, (v) => {return v.num})
        },
        addre : function(rs, text, type, id, index = ''){

            var num = 0

            if(type == 'shocks' || type == 'description'){
                num = _.toArray(rs['shocks']).length + _.toArray(rs['description']).length
            }

            if(type == 'factors'){
                num = _.toArray(rs['factors']).length
            }

            num = num + 1

            if(_.find(rs['shocks'], (t) => {
                return t.text == text
            })) return

            if(_.find(rs['description'], (t) => {
                return t.text == text
            })) return

            if(_.find(rs['factors'], (t) => {
                return t.text == text
            })) return
            
            rs[type][id + '' + index] = {num, text}

        },

        load : function(){

            this.core.pct.scenariosWithCustoms(this.scenarioIds).then((scenarios) => {
                this.scenarios = scenarios

                console.log('scenarios', scenarios)
            })
            
        },

        valuemode : function(factor){

            if (factor.type == 'country' || factor.type == 'currency' || factor.type == 'industry' || factor.type == 'perm_factor' || factor.type == 'stress_index') 
                return 'p100'

            return 'bps'
        }

    },
}