import { mapState } from 'vuex';
import card from "@/components/assets/user/card/index.vue";

export default {
    name: 'topmenu',
    props: {
    },

    components : {
        card
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
		userinfo : state => state.userinfo,

        path : function(){
            return this.$router.currentRoute.name
        },
        mobileview : state => state.mobileview
    }),

    methods : {
        gotohome : function(){
            if (this.mobileview) this.$router.push('/')
            if(!this.mobileview) this.$router.push('/summary')
        }
    },
}