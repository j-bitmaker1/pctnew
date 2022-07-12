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
            console.log('this.$router', this.$router.currentRoute.name)
            return this.$router.currentRoute.name
        }
    }),

    methods : {
        
    },
}