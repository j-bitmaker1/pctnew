import { mapState } from 'vuex';
import status from "../../status/index.vue"
import cmenu from "../menu/index.vue"


export default {
    name: 'campaigns_single_preview',
    props: {
        campaign : Object
    },

    components : {
        status,
        cmenu
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
        open : function(){
            
            if(!this.campaign.Error){
                this.$emit('open')
            }
            
        },

        deletesignle : function(){
            this.$emit('deletesignle')
        }
    },
}