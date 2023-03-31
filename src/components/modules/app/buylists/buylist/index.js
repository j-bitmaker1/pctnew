import { mapState } from 'vuex';
import bmenu from '../menu/index.vue'

export default {
    name: 'buylist',
    props: {
        buylist : Object
    },

    components : {
        bmenu
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