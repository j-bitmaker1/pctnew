import { mapState } from 'vuex';

export default {
    name: 'settings_integrations',
    props: {
    },

    data : function(){

        return {
            loading : false,
            integrations : []
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
        add : function(){
            this.core.vueapi.integrationsAdd()
        }
    },
}