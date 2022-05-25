import { mapState } from 'vuex';

export default {
    name: 'listcontrols',
    props: {
        searchvalue : String,
        count : Number,
        sorting : {
            type : Object,
            default : () => {}
        },
        sortvalue : String,
        activity : String
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
        search : function(v){
            this.$emit('search', v)
        },
        sort : function(e){
            this.$emit('sort', e.target.value)
        }
    },
}