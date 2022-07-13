import { mapState } from 'vuex';
import defaultsignature from "./defaultsignature/index.vue"
export default {
    name: 'campaigns_settings',
    props: {
    },

    components : {
        defaultsignature
    },

    data : function(){

        return {
            loading : false,
            settings : [
                {
                    text : 'campaigns.settings.signatures',
                    view : 'button',
                    route : '/signatures'
                },

                {
                    component : 'defaultsignature'
                },

                {
                    text : 'campaigns.settings.exportStatistic',
                    view : 'button',
                    action : () =>  this.core.campaigns.exportStatistic().catch(e => {})
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
    }),

    methods : {
        action : function(item){
            if(item.action) item.action()

            if(item.route) this.$router.push(item.route).catch(e => {})
        }
    },
}