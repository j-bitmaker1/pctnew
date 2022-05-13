import { mapState } from 'vuex';

import asset from '../asset/index.vue'

export default {
    name: 'assets_list',
    props: {
        assets : Array
    },

    components : {
        asset
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