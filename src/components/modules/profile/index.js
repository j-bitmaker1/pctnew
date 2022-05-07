import { mapState } from 'vuex';
import card from "@/components/assets/user/card/index.vue";

export default {
    name: 'profile',
    props: {
    },

    components : {card},

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
        signout : function(){
            this.core.user.signout()
            this.$router.push('/')
        }
    },
}