import { mapState } from 'vuex';

export default {
    name: 'listselectable',
    props: {
        items: {
			type: [Array, Object],
			required: true,
		},

        context : {
            type : String,
            default : 'general'
        },

        view : {
            type : String,
            default : 'leftselection'
        },

        disabled : Boolean,
        
        filter : Function,
        transition : String

    },

    data : function(){

        return {
			
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

            if(state.selection){
                if(state.selection.context == this.context){


                    return state.selection.items
                }
            }

            return null
        }
	
    }),

    methods : {
        enterSelectionMode : function(item){

            this.select(item)

            /*this.$store.commit('select', {
                context : this.context,
                item
            })*/
			
		},

        select : function(item){

            if(!this.selection || !this.selection[item.ID || item.id]){
                this.$store.commit('select', {
                    context : this.context,
                    items : {[item.ID || item.id] : item}
                })
            }
            else{
                this.$store.commit('unselect', {
                    context : this.context,
                    items : {[item.ID || item.id] : item}
                })
            }
            
        },

        click : function(item){
            this.$emit('click', item)
        },

        touchhold : function(item){

            if(this.disabled) return

            this.enterSelectionMode(item)

            this.$emit('touchhold', item)
        }
       
    },
}