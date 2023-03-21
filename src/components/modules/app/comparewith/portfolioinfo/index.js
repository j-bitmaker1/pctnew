import { mapState } from 'vuex';

import infotable from '../infotable/index.vue'

export default {
    name: 'comparewith_portfolioinfo',
    props: {
        portfolio : Object,
    },

    components : {
        infotable
    },

    data : function(){

        return {
            loading : false,

            fields : [
                {
                    id : 'advisorFee',
                    type : 'p'
                }
            ]
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        portfolioData () {
            return {
                ...this.portfolio || {}
            }
        }
    }),

    methods : {
        
    },
}