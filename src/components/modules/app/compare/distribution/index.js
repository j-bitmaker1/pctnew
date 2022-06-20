import { mapState } from 'vuex';

import distributionMain from '@/components/modules/app/portfolio/distribution/main/index.vue'

import { Distribution } from '@/application/charts/index';
var distribution = new Distribution()

export default {
    name: 'compare_distribution',
    props: {
        ids : Array
    },

    components : {
        distributionMain
    },

    data : function(){

        return {
            loading : false,

            periods : distribution.periods(),
			stds : distribution.stds(),

			period : 1,
			current_std :2,

            portfolios : [],

            series : {}
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
            var o = {height : 300}

            var x = {min : undefined, max : undefined}
            var y = {min : undefined, max : undefined}


            _.each(this.series, (series) => {
                _.each(series, (serie) => {
                    _.each(serie.data, (p) => {
                        if(p.x < x.min || typeof x.min == 'undefined') x.min = p.x
                        if(p.x > x.max || typeof x.max == 'undefined') x.max = p.x

                        if(p.y < y.min || typeof y.min == 'undefined') y.min = p.y
                        if(p.y > y.max || typeof y.max == 'undefined') y.max = p.y
                    })

                })
            })

            o = {
                ... o,
                ... {
                    xmin : x.min,
                    xmax : x.max,
                    ymin : y.min,
                    ymax : y.max
                }
            }

            return o
        }
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
                
            }).finally(() => {
                this.loading = false
            })
        },

        getserie : function(portfolio, serie){
            this.$set(this.series, portfolio.id, serie)
        }
    },
}