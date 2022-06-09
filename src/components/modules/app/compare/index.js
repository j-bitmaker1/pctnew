import { _ } from 'core-js';
import { mapState } from 'vuex';

import ctmain from '../portfolio/crashtest/main/index.vue'

export default {
    name: 'compare',
    props: {
        ids : Array
    },

    components : {ctmain},

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
    }),

    methods : {

        changevaluemode : function(v){
            console.log('changevaluemode')
			this.valuemode = v

            this.load()
		},

        load : function(){

            this.loading = true

            this.core.api.pctapi.portfolios.gets(this.ids).then(r => {

                var portfolios = {}

                _.each(r, (p) => {portfolios[p.id] = p})

                this.portfolios = portfolios

                console.log('this.portfolios', this.portfolios)

                var max = _.max(this.portfolios, (p) => {return p.total()})

                console.log('max', max)

                return this.core.pct.stresstests(_.map(r, (portfolio) => {return portfolio.id}), max.total(), this.valuemode)
                
            }).then((cts) => {

                this.cts = cts

                console.log('this.cts', this.cts)

            }).finally(() => {
                this.loading = false
            })

           
        }
    },
}