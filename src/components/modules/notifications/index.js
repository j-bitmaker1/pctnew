import { mapState } from 'vuex';
import notification from "@/components/modules/notifications/notification/index.vue";
export default {
    name: 'notifications',
    props: {
    },

    data : function(){

        return {
            loading : false
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
        
    },
}