import { mapState } from 'vuex';
const Header = require('@editorjs/header');
const Paragraph = require('@editorjs/paragraph');
import List from '@editorjs/list';

export default {
    name: 'editorjs',
    props: {
        initial : {
            type : Object,
            default : function(){
                return {}
            }
        }
    },

    components: {
    },

    data : function(){

        return {
            loading : false,
            outputData : this.initial,
            config : {

                data : this.initial,
                placeholder : this.placeholder || "Write something",
                tools : {
                    header : {
                        class : Header,
                        levels: [2, 3, 4],
                        defaultLevel: 2,
                        shortcut: 'CMD+SHIFT+H',
                    },
                    
                    list: {
                        class : List,
                        inlineToolbar: true,
                    },

                    paragraph : {
                        class : Paragraph,
                        inlineToolbar: true,
                    },
                },

                onChange : (v) => {

                    v.saver.save().then(outputData => {
                        this.outputData = outputData
                    })
                }
                
            }
        }

    },

    created (){
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        haschanges : function(){
            return JSON.stringify(this.outputData) != JSON.stringify(this.initial)
        }
    }),

    methods : {
        cancel : function(){
            this.$emit('cancel')
            this.close()
        },
        save : function(){
            this.$emit('save', this.outputData)

            this.close()
        },

        close : function(){
            this.$emit('close')
        }
    },
}