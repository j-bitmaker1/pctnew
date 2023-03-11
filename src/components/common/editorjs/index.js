import plugin from 'vue-editor-js/src/index'

Vue.use(plugin)

import { mapState } from 'vuex';
const Header = require('@editorjs/header');
const Paragraph = require('@editorjs/paragraph');
import List from '@editorjs/list';


import PluginFactory from '@/application/campaigns/ui/editorPlugin'


export default {
    name: 'editorjs',
    props: {
        initial: {
            type: Object,
            default: function () {
                return {}
            }
        },

        tips: Array
    },

    components: {
    },

    data: function () {

        var pf = PluginFactory(this.core)
        var plugins = {}

        _.each(pf, (cl, i) => {
            plugins[i] = {
                class : cl
            }
        })

        return {
            loading: false,
            outputData: this.initial,
            config: {

                data: this.initial,
                placeholder: this.placeholder || "Write something",
                tools: {

                    //...plugins,
                    
                    header: {
                        class: Header,
                        levels: [2, 3, 4],
                        defaultLevel: 2,
                        shortcut: 'CMD+SHIFT+H',
                    },

                    list: {
                        class: List,
                        inlineToolbar: true,
                    },

                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                },

                onChange: (v) => {

                    v.saver.save().then(outputData => {
                        this.outputData = outputData
                    })
                }

            }
        }

    },

    created() {
    },


    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth: state => state.auth,
        haschanges: function () {
            return JSON.stringify(this.outputData) != JSON.stringify(this.initial)
        }
    }),

    methods: {
        cancel: function () {
            this.$emit('cancel')
            this.close()
        },
        save: function () {
            this.$emit('save', this.outputData)

            this.close()
        },

        close: function () {
            this.$emit('close')
        }
    },
}