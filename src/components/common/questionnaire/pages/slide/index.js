import { mapState } from 'vuex';

export default {
    name: 'pages_slide',
    props: {
        slide : Object
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
        back : function(){
            this.$emit('back')
        },

        next : function(){
            this.$emit('next')
        }
    },
}