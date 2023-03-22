import { mapState } from 'vuex';

import retrospective from "@/components/modules/app/portfolio/retrospective/index.vue";

export default {
    name: 'comparewith_retrospective',
    props: {
        portfolio : Object,
        assets : Array,
        type : String,
        includemode : {
            type : String,
            default : 'e'
        }
    },

    components : {retrospective},

    data : function(){

        return {
            loading : false
        }

    },

    created () {
       
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
        composePortfolio() {
            var composeParameters = {}

            if(this.type == 'split' && this.includemode != 'i') {composeParameters.portfolio = this.portfolio}

            return this.core.pct.composePortfolio(this.assets, composeParameters)
        },

        portfolios() {

            if(!this.composePortfolio || !this.portfolio) return {}

            return [
                this.portfolio,
                this.composePortfolio
            ]

        }
    }),

    methods : {

        load : function(){


        }
    },
}