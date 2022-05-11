import { mapState } from 'vuex';
import f from "@/application/functions.js";
import client from './client/index.vue'

export default {
    name: 'app_clients',
    props: {
    },

    components : {client},

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
                query : this.core.crm.query('simplesearch', {search : this.searchvalue, type : "CLIENT"})
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

        click : function(client){
            
        }

    },
}