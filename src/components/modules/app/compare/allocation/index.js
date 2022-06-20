import { mapState } from 'vuex';

import allocationMain from "@/components/modules/app/portfolio/allocation/main/index.vue"
import { Allocation } from '@/application/charts/index';

var allocation = new Allocation()

export default {
    name: 'compare_allocation',
    props: {
        ids : Array
    },

    components : {
        allocationMain
    },

    data : function(){

        return {
            loading : false,
            activegrouping : 'type',
			groups : allocation.groups(),
            portfolios : [],
            agroups : {}
        }

    },

    created () {
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        colors : function(){
            var colors = {}

            var allgroups = {}

            _.each(this.agroups, (g) => {
                allgroups = {
                    ...allgroups,
                    ...g
                }
            })

            var c = 0

            _.each(allgroups, (g, i) => {

                colors[i] = allocation.colorbyindex(c)

                c++
            })


            return colors
        }
    }),

    methods : {

        grouping : function(e){
			this.activegrouping = e.target.value
		},

        load : function(){

            this.loading = true

            this.core.api.pctapi.portfolios.gets(this.ids).then(r => {

                this.portfolios = r
                
            }).finally(() => {
                this.loading = false
            })
        },

        getgroups : function(portfolio, grouped){
            this.$set(this.agroups, portfolio.id, grouped)
        },

        drilldown : function(id, portfolio){

            console.log('was', id, portfolio)

            _.each(this.portfolios, (p) => {
                if(this.$refs[p.id] && p.id != portfolio.id){
                    console.log('this.$refs[p.id]', p.id, portfolio.id)
                    this.$refs[p.id][0].doDrilldown(id, true)
                }
            })

            
        },

        drillup : function(portfolio){
            _.each(this.portfolios, (p) => {
                if(this.$refs[p.id] && p.id != portfolio.id){
                    this.$refs[p.id][0].doDrillup(true)
                }
            })
        }
    },
}