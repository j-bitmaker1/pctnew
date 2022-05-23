import { mapState } from 'vuex';

import portfolio from '@/components/modules/app/portfolios/portfolio/index.vue'

export default {
    name: 'aggregations_edit',
    props: {
        type : String,
        aggregation : Object
        //portfolios : Object
    },

    components : {portfolio},

    data : function(){

        return {
            loading : false
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        module : function(){
            if(this.type == 'portfolio') return portfolio
        }
    }),

    methods : {
       
    },
}