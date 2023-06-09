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

                adviserinfo : [
                    {
                        text : 'labels.adviserinfoText',
                        view : 'button',
                        action : () => this.editAdvisorInfo()
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

                integrations : [
                    {
                        text : 'labels.editIntegrations',
                        view : 'button',
                        action : () => this.core.vueapi.integrations()
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
        },

        editAdvisorInfo : function(){

            this.core.settings.user.getall().then((settings) => {

                console.log("settings", settings)

                this.core.vueapi.editcustom({
                    schema : {
                        fields : [
                            {
                                id : 'adviserinfo',
                                text : 'settings.adviserinfo',
                                input : 'textarea',
                                rules : [{
                                    rule : 'required'
                                }]
                            }
                        ]
                    },
                    values : {
                        adviserinfo : settings.adviserinfo.value || '',
                    },

                    caption : "Enter advisor info"

                }, 
                
                (values) => {
                    console.log(values)

                    this.core.settings.user.set('adviserinfo', values.adviserinfo || '').then(() => {

                    }).catch(e => {
                        console.error(e)
                    })
                })

            })
        }

    },
}