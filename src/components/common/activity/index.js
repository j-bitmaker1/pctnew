import _ from 'underscore';
import { mapState } from 'vuex';

import f from "@/application/functions.js"

import portfolio from "@/components/modules/app/activity/portfolio/index.vue"
import client from "@/components/modules/app/activity/client/index.vue"

export default {
    name: 'activity',
    props: {
        searchvalue : String,
        mixgroup : Object
    },

    components : {
        portfolio, client
    },

    data : function(){

        return {
            loading : false
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        history : function(){
            return this.core.user.activity.history
        },

        grouped : function(){
          
            return f.group(this.filtered, (h) => {
                return h.type
            })

        },

        mixgrouped : function(){

            var mixed = {}

            _.each(this.mixgroup, (g, i) => {
                mixed[i] || (mixed[i] = [])

                mixed[i] = mixed[i].concat(g)
            })

            _.each(this.grouped, (g, i) => {
                mixed[i] || (mixed[i] = [])

                mixed[i] = mixed[i].concat(g)
            })

            _.each(mixed, (g, i) => {
                mixed[i] = _.uniq(g, (o) => {
                    return o.index
                })
            })

            return mixed
        },

        filtered : function(){
            var h = this.core.user.activity.history

            if (this.searchvalue){
                h = this.core.user.activity.search(this.searchvalue)
            }

            return h
        }
    }),

    methods : {
        getmodule : function(item){

            if(item.type == 'portfolio') return portfolio
            if(item.type == 'client') return client
            if(item.type == 'lead') return client
            
        },

        open : function(item){
            if (item.link){
                this.$router.push(item.link)

                this.$emit('close')
            }
        }
    },
}