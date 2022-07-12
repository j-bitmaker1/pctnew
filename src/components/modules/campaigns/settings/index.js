import { mapState } from 'vuex';

export default {
    name: 'campaigns_settings',
    props: {
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
                    text : 'campaigns.settings.exportEmailsStatistic',
                    view : 'button',
                    action : () =>  this.core.campaigns.exportEmailsStatistic()
                }
                

                /*{
                    text : 'campaigns.settings.defaultsignature',
                    view : 'button',
                    action : () =>  this.core.vueapi.scoreConverter()
                },*/

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