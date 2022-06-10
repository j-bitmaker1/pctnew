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
            portfolios : []
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
        }
    },
}