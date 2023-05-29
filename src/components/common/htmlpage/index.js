import { mapState } from 'vuex';

export default {
    name: 'htmlpage',
    props: {
        srcdoc : String
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