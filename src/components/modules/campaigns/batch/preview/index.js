import { mapState } from 'vuex';

import bmenu from "../menu/index.vue"
import status from "../../status/index.vue"

export default {
    name: 'campaigns_batch_preview',
    props: {
        batch : Object
    },

    components : {
        bmenu,
        status
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
            this.$emit('open')
        },
        deletebatch : function(){
            this.$emit('deletebatch')
        },
    },
}