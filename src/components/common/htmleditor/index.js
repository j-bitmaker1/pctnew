import { mapState } from 'vuex';
import Trumbowyg from 'vue-trumbowyg';
import 'trumbowyg/dist/ui/trumbowyg.css';

(function ($) {
    'use strict';

    // Plugin default options
    var defaultOptions = {
    };

    function buildButtonDef (trumbowyg) {
        return {
            hasIcon: false,
            text: '@',
            fn: function () {

                trumbowyg.saveRange()
                trumbowyg.o.plugins.variables.open()
                // Plugin button logic
            }
        }
    }


    $.extend(true, $.trumbowyg, {
        // Add some translations
        langs: {
            en: {
                variables: 'Variables'
            }
        },
        // Register plugin in Trumbowyg
        plugins: {
            variables: {
                // Code called by Trumbowyg core to register the plugin
                init: function (trumbowyg) {
                    // Fill current Trumbowyg instance with the plugin default options
                    trumbowyg.o.plugins.variables = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.variables || {}
                    );

                    trumbowyg.$ta.on('tbwinit', function(){
                        trumbowyg.$ed.on('keyup', function(e){
                            trumbowyg.saveRange()
                            trumbowyg.o.plugins.variables.keyup(e)
                        })
                        trumbowyg.$ta.on('keyup', trumbowyg.o.plugins.variables.keyup)
                    })


                    //trumbowyg.addBtnDef('variables', buildButtonDef(trumbowyg));
                },
                // Return a list of button names which are active on current element
                tagHandler: function (element, trumbowyg) {
                    return [];
                },
                destroy: function (trumbowyg) {
                    if (trumbowyg.$ed)
                        trumbowyg.$ed.off('keyup', trumbowyg.o.plugins.variables.keyup)

                    if (trumbowyg.$ta)
                        trumbowyg.$ta.off('keyup', trumbowyg.o.plugins.variables.keyup)
                }
            }
        }
    })
})(jQuery);

export default {
    name: 'htmleditor',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        modelValue: String,
    },
    components: {
        Trumbowyg
    },
    data: function () {

        return {
            loading: false
        }

    },
    emits: ['update:modelValue'],
    created: function () {
      
    },

    watch: {
        //$route: 'getdata'
    },
    computed: {
        config : function(){
            return {
                btns : [
                    ['viewHTML'],
                    ['variables'],
                    ['formatting'],
                    ['strong', 'em', 'del'],
                    ['superscript', 'subscript'],
                    ['link'],
                    ['insertImage'],
                    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                    ['unorderedList', 'orderedList'],
                    ['horizontalRule'],
                    ['removeformat'],
                ],

                autogrow: true,

                plugins : {
                    variables : {
                        keyup : (e) =>{
                            this.$emit('keyup', e.originalEvent)
                        },

                        open : function(){

                        }
                    }
                }
                
            }
        },
        body: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }, ...mapState({
            auth: state => state.auth,
        })
    },

    methods: {
        init : function(v){
        }
    },
}