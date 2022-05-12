import { mapState } from 'vuex';

export default {
    name: 'iconstoggle',
    props: {
        value : String,
        icons : Array
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
        change : function(v){
            this.$emit('change', v)
        }
    },
}