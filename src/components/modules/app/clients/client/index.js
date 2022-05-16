import { mapState } from 'vuex';
import profilemenu from "@/components/modules/app/client/menu/index.vue";
export default {
    name: 'clients_client',
    props: {
        profile : Object
    },

    components : {profilemenu},

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
        edit : function(profile){
            this.$emit('edit', profile)
        },

        open : function(profile){
            this.$emit('open', profile)
        },
    },
}