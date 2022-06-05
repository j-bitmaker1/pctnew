import _ from 'underscore';
import { mapState } from 'vuex';

export default {
    name: 'selection',
    props: {
        context : {
            type : String,
            default : 'general'
        },

        menu : Array
    },

    data : function(){

        return {
            loading : false,
            showmenu : false
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        selection : function(state) {

            console.log('state.selection', state.selection)

            if(state.selection){
                if(state.selection.context == this.context){
                    return state.selection
                }
            }

            return null
        },

        selectionLength : function(){
            if (this.selection){
                return _.toArray(this.selection.items).length
            }
        },

        selectedMenu : function(){
            return _.map(this.menu, (item) => {

                return {
                    ... item,
                    ... {
                        action : () => {

                            var result = item.action(this.selection.items)

                            if(typeof result != 'undefined'){

                                if (result.then) return result.then(r => {

                                    this.clear()

                                    return Promise.resolve(r)
                                })

                                if (result === false){

                                    return
                                }

                            }

                            this.clear()
                        }
                    }
                }

            })
        }
    }),

    methods : {
        cancel : function(){
            this.$emit('cancel')
            this.clear()
        },
        success : function(){

            if (this.menu){
                this.showmenu = true
            }
            else{
                this.$emit('success', this.selection.items)
                this.clear()
            }
            
        },

        close : function(){
            this.showmenu = false
        },

        clear : function(){
            this.$store.commit('unselect', {context : this.context})
        }

    },
}