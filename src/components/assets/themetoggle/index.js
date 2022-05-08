import { mapState } from 'vuex';

export default {
    name: 'themeToggle',
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
        theme : state => state.theme
    }),

    methods : {
        set : function(v){
            this.$store.commit('theme', v)
        }
    },
}