import { mapState } from 'vuex';

/// TO DO DYNAMIC IMPORT
import home from "@/components/modules/app/home/index.vue";
import portfolios_edit from "@/components/modules/app/portfolios/edit/index.vue";
import clients_edit from "@/components/modules/app/clients/edit/index.vue";

import share from "@/components/common/share/index.vue";


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
        mclass : String
    },

    data : function(){

        return {
            loading : false,
            scroll : 0
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
        home, portfolios_edit, share, clients_edit
    },
 
    computed: mapState({
        auth : state => state.auth,

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
            console.log("E", e)
        },

        scrolling : function(e){
            this.scroll = e.target.scrollTop
        },

        moving : function(e, h){
        }
    },
}