import { mapState } from 'vuex';
import themeToggle from "@/components/assets/themetoggle/index.vue";

export default {
    name: 'appmenu',
    props: {
    },

    components : {
        themeToggle
    },

    data : function(){

        return {
            loading : false,

            items : [
                {
                    route : '/',
                    id : 'home',
                    text : 'menu.home',
                    icon : "fas fa-th"
                },
                {
                    route : '/clients',
                    id : 'clients',
                    text : 'menu.clients',
                    icon : "fas fa-users"
              
                },
                {
                    route : '/leads',
                    id : 'leads',
                    text : 'menu.leads',
                    icon : "fas fa-user-plus"
                },
                {
                    route : '/portfolios',
                    id : 'portfolios',
                    text : 'menu.portfolios',
                    icon : "fas fa-suitcase"
                },
                {
                    route : '/profile',
                    id : 'profile',
                    text : 'menu.profile',
                    icon : "fas fa-user"
                },
            ]
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        active : function(){

            var path = this.$route.path

            var r = _.find(this.items, function(i){
                return i.route == path
            })

            if(r) return r.id

            return 'home'
        }
    }),

    methods : {
        notifications : function(id){
            if(id == 'leads') return Math.max(3, 99)
        },
        signout : function(){
            this.core.user.signout()
            this.$router.push('/')
        }
    },
}