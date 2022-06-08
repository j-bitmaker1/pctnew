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
    },
 
    computed: mapState({
        auth : state => state.auth,

        swipeableOptions : function(){
            return {
                swipeOutBy : '0px',
                swipeAwayBy : '0px',
                swipeAwayThreshold : '0px',
                swipeOutThreshold : '0px',
                type : 'vertical',
                allowedDirection : this.scroll ? '' : 'bottom',
                debug : true
            }
        },

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
                        console.log("this.scroll", this.scroll)
                        return this.scroll <= 0 && !this.blockTouch
                    }   
                }  
            }
        }

    }),

    methods : {
        endswipe : function(direction){

            this.$emit('close')
        },
        close : function(){
            this.$emit('close')
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

        moving : function(e, h){
        }
    },
}