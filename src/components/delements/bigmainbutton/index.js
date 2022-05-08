import { mapState } from 'vuex';

export default {
    name: 'bigmainbutton',

    props: {
        icon : String,
        label : String,
        blabel : String,
        nlabel : String,
        active: Boolean
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