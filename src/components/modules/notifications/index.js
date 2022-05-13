import { mapState } from 'vuex';
import notification from "@/components/modules/notifications/notification/index.vue";
export default {
    name: 'notifications',
    props: {
    },

    data : function(){

        return {
            loading : false,

            selected : null,
            menu : [
               
                {
                    text : 'labels.deletenotifications',
                    icon : 'fas fa-trash',
                    action : 'deletenotifications'
                }
            ]
        }

    },

    created : () => {

    },

    components : {
        notification
    },

    watch: {
        tscrolly : function(){

            if (this.$refs['list']){

                if (this.$refs['list'].height() - 1000 < this.tscrolly + this.dheight){
                    this.$refs['list'].next()
                }
                
            }
            
        }
    },
    computed: mapState({
        dheight: state => state.dheight,
        tscrolly : state => state.tscrolly,
        auth : state => state.auth,

        payload : function(){
            return {}
        }
    }),


    methods : {

        selectionSuccess : function(notifications){
            this.selected = notifications
        },

        closeselected : function(){
            this.selected = null
        },

        menuaction : function(action){
            if (this[action]){
                this[action]()
            }   
        },

        deletenotifications : function(){

        }
    },
}