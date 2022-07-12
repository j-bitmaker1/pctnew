import { mapState } from 'vuex';
import cmenu from "../menu/index.vue"
import moment from 'moment'


export default {
    name: 'signature_preview',
    props: {
        signature : Object
    },

    components : {
        cmenu
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
        open : function(){
            this.$emit('open')
        }
    },
}