import { mapState } from 'vuex';

import portfoliolist from '../list/index.vue'
import filesystem from '@/components/common/filesystem/index.vue'

export default {
    name: 'portfolios_main',
    props: {
    },

    components : {
        portfoliolist, 
        filesystem
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
    }),

    methods : {
        
    },
}