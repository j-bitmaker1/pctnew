import { mapState } from 'vuex';
import history from '../history/index.vue'

export default {
    name: 'ai_contents',
    props: {
    },

    components : {
        history
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

        componentscrolling : function(e){
            this.$emit('componentscrolling', e)
        },
        
        startnewchat : function(){
            this.$emit('startnewchat')
            this.$emit('close')
        },

        selectchat : function(d){
            this.$emit('selectchat', d)
            this.$emit('close')
        },
    },
}