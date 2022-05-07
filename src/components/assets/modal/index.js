import { mapState } from 'vuex';

export default {
    name: 'modal',
    props: {
        displayFooter : {
            default : true,
            type : Boolean
        },
        cantclose : Boolean
    },

    data : function(){

        return {
            loading : false
        }

    },

    mounted() {
    },
    
    destroyed() {
    },

    watch: {
        //$route: 'getdata'
    },

  
 
    computed: mapState({
        auth : state => state.auth,
        pocketnet: state => state.pocketnet,
        minimized : state => state.minimized,
        active: state => state.active,
        mobile: state => state.mobile,
    }),

    methods : {
        close : function(){
            this.$emit('close')
        }
    },
}