import { mapState } from 'vuex';

export default {
    name: 'topheader',
    props: {
        back : {
            type: String,
            default: "",
        }
    },

    data : function(){

        return {
            loading : false
        }

    },

    created : function() {
    },

    watch: {
        //$route: 'getdata'
    },

    

    computed: mapState({
        auth : state => state.auth,
        pocketnet: state => state.pocketnet,
        minimized: state => state.minimized,
        active : state => state.active,
    }),

    methods : {
       
    },
}