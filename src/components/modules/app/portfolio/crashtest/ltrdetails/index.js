import { mapState } from 'vuex';

export default {
    name: 'portfolio_ltrdetails',
    props: {
        portfolios : Object
    },

    data : function(){

        return {
            loading : false,
            details : {},
            columns : [

                {
                    id : 'ticker',
                    type : 'string'
                },

                {
                    id : 'name',
                    type : 'string'
                },

                {
                    id : 'expRatio',
                    type : 'p',
                    tip : true
                },

                {
                    id : 'lclbeta',
                    type : 'p',
                    tip : true
                },
                {
                    id : 'lclidx',
                    type : 'p',
                    tip : true
                },
                {
                    id : 'ltr',
                    type : 'p'
                },
                {
                    id : 'yield',
                    type : 'p',
                    tip : true
                },
                {
                    id : 'value',
                    type : 'portfolioValue'
                },

            ]
        }

    },

    created (){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        tips () {
            return _.filter(this.columns, (c) => {
                return c.tip
            })
        },

        rows () {
            var r = {}

            _.each(this.portfolios, (portfolio) => {
                r[portfolio.id] = _.sortBy(_.map(portfolio.positions, (asset) => {

                    return {
                        ...asset,
                        ... this.details && this.details[portfolio.id] ? this.details[portfolio.id][asset.ticker] || {} : {}
                    }
    
                }), (asset) => {
                    return -asset.value
                })
            })

            return r
             
        }
    }),

    methods : {
        load : function(){


            this.details = {}

            if(!this.portfolios) {
                return
            }

            this.loading = true

            Promise.all(_.map(this.portfolios, (portfolio) => {

                return this.core.pct.ltrdetails({portfolioId : portfolio.id}).then((r) => {
                    this.$set(this.details, portfolio.id, r)
                    //this.details[portfolio.id] = r

                    return Promise.resolve()
                }).catch(e => {
                    return Promise.resolve()
                })

            })).then(() => {
                this.loading = false
            })

            
        },

    },
}