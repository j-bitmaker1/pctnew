import { mapState } from 'vuex';
import f from "@/application/functions.js";
import lead from './lead/index.vue'
import _ from 'underscore';

export default {
    name: 'app_leads',
    props: {
    },

    components : {lead},

    data : function(){

        return {
            loading : false,
            searchvalue : '',
            count : 0,
           
            sort : 'FName_asc',
            sorting : {
                FName_asc : {
                    text : 'fname_asc',
                    field : 'FName',
                    sort : 'asc'
                },
                FName_desc : {
                    text : 'fname_desc',
                    field : 'FName',
                    sort : 'desc'
                }
            },


            selected : null,
            menu : [

                {
                    text : 'labels.leadstocontacts',
                    icon : 'fas fa-user-friends',
                    action : 'leadstocontacts'
                },
               
                {
                    text : 'labels.deleteleads',
                    icon : 'fas fa-trash',
                    action : 'deleteleads'
                },

            ]

        }

    },

    created : function() {
    },

    watch: {
        tscrolly : function(){


            if (this.$refs['list']){


                if (this.$refs['list'].height() - 1000 < this.tscrolly + this.dheight){
                    this.$refs['list'].next()
                }
                
            }

            
        }
    },
    computed: mapState({
        auth : state => state.auth,
        tscrolly : state => state.tscrolly,
        dheight : state => state.dheight,

        payload : function(){

            var orderBy = {}

            orderBy[this.sorting[this.sort].field] = this.sorting[this.sort].sort

            return {
                orderBy,
                query : this.core.crm.query('simplesearch', {search : this.searchvalue, type : "LEAD"})
            }
        },

        elheight : function(){

            return f.mobileview() ? 195 : 120
        }
    }),

    methods : {

        search : function(v){
            this.searchvalue = v
        },

        setcount : function(v){
            this.count = v
        },

        sortchange : function(v){
            this.sort = v
        },

        selectionSuccess : function(leads){
            this.selected = leads
        },

        closeselected : function(){
            this.selected = null
        },

        menuaction : function(action){
            if (this[action]){
                this[action]()
            }   
        },

        deleteleads : function(){

            this.closeselected()

        },

        open : function(client){

            this.$store.commit('OPEN_MODAL', {
                id : 'modal_client_page',
                module : "lead_page",
                caption : "",
                mclass : 'withoutheader',
                data : {
                    
                    leadid : client.ID
                },

                events : {
                    
                }
            })

        },

        leadstocontacts : function(){

            this.$store.commit('globalpreloader', true)

            console.log('_.map(selected, (s) => {return s.ID})', _.map(this.selected, (s) => {return s.ID}))

            this.core.crm.leadtocontacts(_.map(this.selected, (s) => {return s.ID})).then(r => {

                console.log("R", r)

                this.closeselected()

                //this.$router.push('/clients')

            }).catch(e => {

                console.log("E", e)

                this.$store.commit('icon', {
                    icon: 'error',
                    message: e.error
                })

            }).finally(() => {

                this.$store.commit('globalpreloader', false)

            })

            

        },


    },
}