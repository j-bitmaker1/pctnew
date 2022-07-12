import { mapState } from 'vuex';
import themeToggle from "@/components/assets/themetoggle/index.vue";
import faseIdToggle from "@/components/assets/faceidtoggle/index.vue";

export default {
    name: 'settings',
    props: {
    },

    components : {
        faseIdToggle, themeToggle
    },

    data : function(){

        return {
            loading : false,

            settings : {
                interface : [
                    {
                        component : themeToggle
                    }
                ],

                pdf : [
                    {
                        text : 'labels.pdfSettings',
                        view : 'button',
                        action : () => this.core.vueapi.pdfSettings()
                    }
                ],

                stress : [
                    {
                        text : 'labels.scenarioManager',
                        view : 'button',
                        action : () => this.core.vueapi.scenarioManager()
                    },

                    {
                        text : 'labels.scoreConverter',
                        view : 'button',
                        action : () =>  this.core.vueapi.scoreConverter()
                    },

                ],

                campaigns : [
                    {
                        text : 'labels.campaignsSettings',
                        view : 'button',
                        route : '/campaigns?p=settings'
                    },

                ],

                account : [

                    {
                        text : 'labels.licence',
                        view : 'button',

                        route : '/features'
                    },

                    {
                        text : 'common.2901009',
                        view : 'button',

                        route : '/changepassword'
                    },

                    {
                        component : faseIdToggle
                    }
                ]
            }
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