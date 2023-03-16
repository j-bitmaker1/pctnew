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

        scoreConverterChanged : function(){
			this.load()
		},

        scenariosChanged : function(){
            this.load()
        },  

        load : function(){

            this.loading = true

            var task = f.makeid()

            this.taskid = task

            var sc = 'stresstestWithPositions'

            if(this.type == 'split') sc = 'stresstestWithPositionsSplit'

            this.core.pct[sc](this.portfolio, this.assets, this.valuemodecomposed).then((r) => {

                if (task == this.taskid){
                    this.cts = r.result
                    this.portfolios = r.portfolios
                }
                
            }).finally(() => {
                this.loading = false

                this.taskid = null
            })
           
        }
    },
}