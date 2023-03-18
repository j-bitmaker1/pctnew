import { mapState } from 'vuex';
import f from "@/application/shared/functions.js";

import ctmain from '@/components/modules/app/portfolio/crashtest/main/index.vue'
import ctmenu from '@/components/modules/app/portfolio/crashtest/menu/index.vue'
import summarybutton from '@/components/delements/summarybutton/index.vue'
import crsliders from '../crsliders/index.vue'
export default {
    name: 'comparewith_stress',
    props: {
        portfolio : Object,
        assets : Array,
        type : String
    },

    components : {ctmain, ctmenu, summarybutton, crsliders},

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

            includemode : localStorage['comparewith_includemode'] || 'e',
            includemodes : [
				{
					icon : "fas fa-chart-pie",
					id : 'i'
				},
				{
					icon : "fas fa-plus-circle",
					id : 'e'
				}
			],

            summary : [

				{
					text : 'labels.crashrating',
					index : 'ocr'
				}
				
			],

            taskid : null
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
        },

        assets : {
            deep : true,
            immediate : true,
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

        changeincludemode : function(v){
			this.includemode = v

            localStorage['comparewith_includemode'] = v

            this.load()
		},

        scoreConverterChanged : function(){
			this.load()
		},

        scenariosChanged : function(){
            this.load()
        },  

        getassetslistsIncludeMode : function(){
            var list = [this.portfolio.positions]
           
            var total = this.portfolio.total()
            var sum = _.reduce(this.assets, (m, v) => {return m + v.value}, 0)

            if (total <= sum){
                list.push(this.assets)
                return list
            }

            var d = total - sum

            var portfolioPositions = _.map(this.portfolio.positions, (asset) => {
                var a = _.clone(asset)

                a.value = a.value * (d / total)

                return a
            })

            portfolioPositions = portfolioPositions.concat(this.assets)

            console.log('portfolioPositions' , portfolioPositions)

            list.push(portfolioPositions)

            return list
        },

        load : function(){

            var promise = null

            this.loading = true

            var sc = 'stresstestWithPositions'

            if(this.type == 'split') {
                sc = 'stresstestWithPositionsSplit'

                if(this.includemode == 'i'){
                    promise = this.core.pct.stresstestPositionsList(this.getassetslistsIncludeMode(), this.valuemodecomposed, {
                        names : [this.portfolio.name]
                    })
                }
            }   


            if(!promise)
                promise = this.core.pct[sc](this.portfolio, this.assets, this.valuemodecomposed)

            if (promise && promise.then){

                this.loading = true

                var task = f.makeid()

                this.taskid = task

                promise.then((r) => {

                    this.cts = r.result
                    this.portfolios = r.portfolios
                    
                }).finally(() => {
                    this.loading = false

                    this.taskid = null
                })

            }
                

            
           
        }
    },
}