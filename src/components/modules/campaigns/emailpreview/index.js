import { mapState } from 'vuex';
import card from "@/components/assets/user/card/index.vue";
import client from "@/components/modules/app/client/linepreview/index.vue";
export default {
    name: 'campaigns_emailpreview',
    props: {
        subject : String,
        body : String,
        date : String,
        email : String,
        name : String,
        profile : Object,
        read : String
    },

    components : {
        card, client
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
        userinfo : state => state.userinfo
    }),

    methods : {
        
    },
}