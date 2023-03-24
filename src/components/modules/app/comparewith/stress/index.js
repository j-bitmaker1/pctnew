import { mapState } from 'vuex';

import ctmain from '@/components/modules/app/portfolio/crashtest/main/index.vue'
import summarybutton from '@/components/delements/summarybutton/index.vue'
import crsliders from '../crsliders/index.vue'
export default {
    name: 'comparewith_stress',
    props: {
        portfolio : Object,
        assets : Array,
        type : String,
        name : String,
        includemode : {
            type : String,
            default : 'e'
        }
    },

    components : {ctmain, summarybutton, crsliders},

    data : function(){

        return {
            loading : false,
            portfolios : {},
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

            summary : [

				{
					text : 'labels.crashrating',
					index : 'ocr'
				}
				
			]
        }

    },

    created () {
        this.load()
    },

    watch: {

        assets : {
            deep : true,
            handler : function(){
                this.load()
            }
        },

        includemode : {
            handler : function(){
                this.load()
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,
        dollars : state => state.dollars,
        hasdollarsvm : function(){

            if(this.dollars != 'd') return false

            var dp = _.filter(this.portfolios, (p) => {
                return !p.isModel
            })

            return dp.length && !_.find(this.portfolios, (p) => {
                return p.isModel
            }) ? true : false

        },

        valuemodecomposed : function(){
            return !this.hasdollarsvm ? 'p' : this.valuemode
        }
    }),

    methods : {

        summatytext : function(id){
            return this.portfolios[id].name
        },

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


            var sc = (this.type == 'split' && this.includemode != 'i') ? 'stresstestWithPositionsSplit' : 'stresstestWithPositions'
            
            this.loading = true

            this.core.pct[sc](this.portfolio, this.assets, this.valuemodecomposed, {
                term : this.type == 'split', 
                name : this.name ? this.name : (this.assets[0] ? this.assets[0].name : ''),
                
                fee : (asset) => {

                    if(!asset){
                        return this.portfolio.advisorFee
                    }

                    if (this.portfolio.has(asset.ticker) || this.type != 'split'){
                        return this.portfolio.advisorFee
                    }
                    
                    return 0
                }
            }).then((r) => {

                this.cts = r.result
                this.portfolios = r.portfolios
                
            }).finally(() => {
                this.loading = false

            })

        }
    },
}