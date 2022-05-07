import { mapState } from 'vuex';

import lead from './lead/index.vue'

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
            }
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
        }

        /*load : function(){
            this.loading = true
            this.core.api.crm.contacts.list().then(data => {

                console.log('data', data)

            }).catch(e => {
                console.error('e', e)

            }).finally(() => {
                this.loading = false
            })
        }*/
    },
}