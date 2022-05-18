import { mapState } from 'vuex';

/// TO DO DYNAMIC IMPORT
import home from "@/components/modules/app/home/index.vue";
import portfolio_edit from "@/components/modules/app/portfolio/edit/index.vue";
import client_edit from "@/components/modules/app/client/edit/index.vue";
import portfolio_crashtest_scenariodetails from "@/components/modules/app/portfolio/crashtest/scenariodetails/index.vue";

import share from "@/components/common/share/index.vue";
import pdfparser from "@/components/common/pdfparser/index.vue";

import client_page from "@/views/client.vue";
import lead_page from "@/views/lead.vue";
import portfolios_main from "@/components/modules/app/portfolios/main/index.vue";

import clients from "@/components/modules/app/clients/index.vue";


import filesystem_edit from "@/components/common/filesystem/edit/index.vue";

export default {
    name: 'modal',
    props: {
        displayFooter : {
            default : true,
            type : Boolean
        },
        cantclose : Boolean,
        module : String,
        data : Object,
        events : {
            type : Object,
            default : () => {return {}}
        },
        mclass : String
    },

    data : function(){

        return {
            loading : false,
            scroll : 0,

            
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
        home, portfolio_edit, share, client_edit, 
        portfolio_crashtest_scenariodetails, 
        portfolios_main, client_page, lead_page,
        pdfparser, clients, filesystem_edit
    },
 
    computed: mapState({
        auth : state => state.auth,

        /*swipeableOptions : function(){
            return {
                swipeOutBy : '0px',
                swipeAwayBy : '0px',
                swipeAwayThreshold : '0px',
                swipeOutThreshold : '0px',
                type : 'vertical',
                allowedDirection : this.scroll ? '' : 'bottom',
                debug : true
            }
        }*/

        /*moduleInstance () {
            console.log('./' + this.module)
            //return (resolve) => {require([this.module], resolve) }
            return () => import(this.module)
        }*/
    }),

    methods : {
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
        },

        moving : function(e, h){
        }
    },
}