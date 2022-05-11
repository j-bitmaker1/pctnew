import { mapState } from 'vuex';

export default {
    name: 'portfolios_list',
    props: {
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
        portfolios : state => state.portfolios
    }),

    methods : {
        select : function(){

        }
    },
}