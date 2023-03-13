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
        dollars : state => state.dollars
    }),

    methods : {
        set : function(v){
            this.$store.commit('dollars', v)
        },

        seta : function(){
            var v = 'p'

            if(this.dollars == 'p') v = 'd'

            this.$store.commit('dollars', v)
        }
    },
}