import { mapState } from 'vuex';

export default {
    name: 'modals',
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
        modals : state => state.modals,

        
    }),

    methods : {
        close : function(id){
            this.$store.commit('CLOSE_MODAL', id)
        },
        scroll : function(v){

        }
    },
}