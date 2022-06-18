import { _ } from 'core-js';
import { mapState } from 'vuex';

import ctmain from '@/components/modules/app/portfolio/crashtest/main/index.vue'
import ctmenu from '@/components/modules/app/portfolio/crashtest/menu/index.vue'

export default {
    name: 'compare',
    props: {
        ids : Array
    },

    components : {ctmain, ctmenu},

    data : function(){

        return {
            loading : false,
            portfolios : [],
            cts : {},
            valuemode : 'p',
            valuemodes : [
				{
					icon : "fas fa-dollar-sign",
					id : 'd'
				},
				{
					icon : "fas fa-percent",
					id : 'p'
				}
			],
        }

    },

    created : () => {

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

        hasdollarsvm : function(){

            var dp = _.filter(this.portfolios, (p) => {
                return !p.isModel
            })

            return dp.length && !_.find(this.portfolios, (p) => {
                return p.isModel
            }) ? true : false

        }
    }),

    methods : {

        changevaluemode : function(v){
			this.valuemode = v

            this.load()
		},

        scoreConverterChanged : function(){
			this.load()
		},

        scenariosChanged : function(){
            this.load()
        },  

        load : function(){

            this.loading = true

            this.core.api.pctapi.portfolios.gets(this.ids).then(r => {

                var portfolios = {}

                _.each(r, (p) => {portfolios[p.id] = p})

                this.portfolios = portfolios

                var max = _.max(this.portfolios, (p) => {return p.total()})

                return this.core.pct.stresstests(_.map(r, (portfolio) => {return portfolio.id}), max.total(), this.valuemode)
                
            }).then((cts) => {

                this.cts = cts

            }).finally(() => {
                this.loading = false
            })

           
        }
    },
}