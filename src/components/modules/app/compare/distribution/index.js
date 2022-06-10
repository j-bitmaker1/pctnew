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

            portfolios : []
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
        }
    },
}