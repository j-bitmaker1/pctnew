import { mapState } from 'vuex';


import bigmainbutton from "@/components/delements/bigmainbutton/index.vue";

export default {
    name: 'home',
    props: {
    },

    components : {
        bigmainbutton
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