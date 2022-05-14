import { mapState } from 'vuex';

import portfoliolist from '@/components/modules/app/portfolios/list/index.vue'

export default {
    name: 'client_portfolios',
    props: {
    },

    components : {
        portfoliolist, 
    },

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

        payload : function(){
            return {
                crmContactIdFilter : 1
            }
        }
    }),

    methods : {
        
    },
}