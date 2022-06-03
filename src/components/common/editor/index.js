import { mapState } from 'vuex';
import { Editor } from 'vue-editor-js'

export default {
    name: 'editor',
    props: {
    },

    components: {
        Editor,
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