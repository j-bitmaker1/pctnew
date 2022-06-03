import { mapState } from 'vuex';
import Editor from 'vue-editor-js/src/index'

export default {
    name: 'editor',
    props: {
    },

    components: {
        editor : Editor,
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
        config : function(){
            return {

                header : {
                    levels: [2, 3, 4],
                    defaultLevel: 2,
                    shortcut: 'CMD+SHIFT+H',
                },

                quote: {
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+O',

                    config: {
                      quotePlaceholder: 'Enter a quote',
                      captionPlaceholder: 'Quote\'s author',
                    }
                },
                
                list: {
                    inlineToolbar: true,
                },
                
            }
        }
    }),

    methods : {
        
    },
}