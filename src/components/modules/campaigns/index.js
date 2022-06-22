import { mapState } from 'vuex';

import dashboard from './dashboard/index.vue'


export default {
    name: 'campaigns',
    
    props: {
    },
    components : {dashboard},
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