import { mapState } from 'vuex';


import notification from '@/components/modules/notifications/notification/index.vue';

export default {
    name: 'modal',
    props: {
        displayFooter : {
            default : true,
            type : Boolean
        },
        cantclose : Boolean,
        module : String,
        path : String,
        data : {
            type : Object,
            default : () => {return {}}
        },
        events : {
            type : Object,
            default : () => {return {}}
        },
        mclass : String,
        fromtop : Boolean
    },

    data : function(){
        

        return {
            loading : false,
            scroll : 0,
            blockclose : null,
            blockTouch : false,
        }

    },

    mounted() {

    },
    
    destroyed() {
    },

    watch: {
        //$route: 'getdata'
    },

    components : {
        notification,
        
        home : () => import("@/components/modules/app/home/index.vue"),
        portfolio_edit : () => import("@/components/modules/app/portfolio/edit/index.vue"),
        client_edit : () => import("@/components/modules/app/client/edit/index.vue"),
        portfolio_crashtest_scenariodetails : () => import("@/components/modules/app/portfolio/crashtest/scenariodetails/index.vue"),
        share : () => import("@/components/common/share/index.vue"),
        pdfparser : () => import("@/components/common/pdfparser/index.vue"),
        client_page : () => import("@/views/client.vue"),
        lead_page : () => import("@/views/lead.vue"),
        portfolios_main : () => import("@/components/modules/app/portfolios/main/index.vue"),
        clients : () => import("@/components/modules/app/clients/index.vue"),
        contacts : () => import("@/components/modules/app/contacts/index.vue"),
        filesystem_edit : () => import("@/components/common/filesystem/edit/index.vue"),
        filesystem : () => import("@/components/common/filesystem/index.vue"),
        homesearch : () => import("@/components/modules/app/home/search/index.vue"),
        scenarios_list : () => import("@/components/modules/app/scenarios/list/index.vue"),
        filemanager : () => import("@/components/common/filemanager/index.vue"),
        filemanager_file : () => import("@/components/common/filemanager/pages/file/index.vue"),
        pdfviewer : () => import("@/components/common/pdfviewer/index.vue"),
        assets_search : () => import("@/components/modules/app/assets/search/index.vue"),
        pincode : () => import("@/components/assets/pincode/index.vue"),
        portfoliopdf :  () => import("@/components/modules/app/portfolio/createpdf/index.vue"),
        editorjs : () => import("@/components/common/editorjs/index.vue"),
        explore : () => import("@/views/explore.vue"),
        fastmenu: () => import("@/components/modules/appmenu/fastmenu/index.vue"),
        settings_scoreConverter: () => import("@/components/modules/app/settings/scoreConverter/index.vue"),
        pdfSettings: () => import("@/components/modules/app/settings/pdf/wnd.vue"),
        questionnaire_client: () => import("@/components/modules/app/client/questionnaire/index.vue"),
        scenario_custom: () => import("@/components/modules/app/scenarios/custom/index.vue"),
        scenario_allfactors: () => import("@/components/modules/app/scenarios/allfactors/index.vue"),


        //// campaigns

        campaigns_steps_edit: () => import("@/components/modules/campaigns/steps/edit/index.vue"),
        campaigns_steps_selectemails: () => import("@/components/modules/campaigns/steps/selectemails/index.vue"),
        campaigns_variables: () => import("@/components/modules/campaigns/variables/index.vue"),
        campaigns_start: () => import("@/components/modules/campaigns/start/index.vue"),
        campaigns_selecttemlpate: () => import("@/components/modules/campaigns/templates/index.vue"),
        campaigns_template: () => import("@/components/modules/campaigns/template/main/index.vue"),
        campaigns_emailpreview: () => import("@/components/modules/campaigns/emailpreview/index.vue"),
        
        
    },
 
    computed: mapState({
        auth : state => state.auth,


        directionsNotification : function(){
            return {
                top : {
                    trueshold : 1,
                    distance : 100,
                    direction : 'top',
                    constraints : (e) => {
                        return this.scroll <= 0 && !this.blockTouch
                    }   
                }  
            }
        },

        directions : function(){
            return {
                [this.fromtop ? 'top' : 'bottom'] : {
                    distance : 100,
                    direction : this.fromtop ? 'top' : 'bottom',
                    constraints : (e) => {
                        return this.scroll <= 0 && !this.blockTouch
                    }   
                }  
            }
        },


    }),

    methods : {
        endswipe : function(direction){

            this.close()
        },
        close : function(){

            if(!this.blockclose){
                this.$emit('close')
            }
            else{

                this.vm.$dialog.confirm(
                    this.vm.$t(this.blockclose), {
                    okText: "Yes, close",
                    cancelText : 'No'
                })
        
                .then((dialog) => {
                    this.setblockclose(null)
                    this.$emit('close')
                }).catch( e => {
                    
                })

            }
        },

        closeiftop : function(e){
            //if(!this.scroll) this.close()
        },

        swipeHandler : function(e){
        },

        scrolling : function(e){
            this.scroll = e.target.scrollTop

            if (this.scroll > 0){
                this.blockTouch = true

                setTimeout(() => {
                    this.blockTouch = false
                }, 500)
            }
            
        },

        setblockclose : function(text){
            this.blockclose = text
        },

        moving : function(e, h){
        },

        /*bypath : function(){
            return require("@/components/" + this.path).default
        }*/

        
    },
}