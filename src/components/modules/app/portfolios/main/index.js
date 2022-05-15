import { mapState } from 'vuex';

import portfoliolist from '../list/index.vue'
import filesystem from '@/components/common/filesystem/index.vue'

export default {
    name: 'portfolios_main',
    props: {
        additional : Object,
        select : Object
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
        selected : function(portfolios){

            console.log('portfolios', portfolios)
            this.$emit('selected', portfolios)
            this.$emit('close')
        },

        selectedFile : function(file){

            this.selected()
            ////
        }
    },
}