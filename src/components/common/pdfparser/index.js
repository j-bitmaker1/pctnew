import { mapState } from 'vuex';


export default {
    name: 'pdfparser',
    props: {
    },

    components : {
        
    },

    data : function(){

        return {
            loading : false,
            src : "https://rixtrema.net/pdfparser"
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
        onLoad : function(){

        }
    },
}