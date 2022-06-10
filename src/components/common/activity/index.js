import _ from 'underscore';
import { mapState } from 'vuex';

import f from "@/application/functions.js"

import portfolio from "@/components/modules/app/activity/portfolio/index.vue"
import portfoliopdf from "@/components/modules/app/activity/portfoliopdf/index.vue"
import client from "@/components/modules/app/activity/client/index.vue"
import search from "@/components/modules/app/activity/search/index.vue"
import themeToggle from "@/components/assets/themetoggle/index.vue"
import def from "@/components/modules/app/activity/def/index.vue"

export default {
    name: 'activity',
    props: {
        searchvalue : String,
        mixgroup : Object,
        loading : Boolean
    },

    components : {
        portfolio, client, search, themeToggle, def
    },

    data : function(){

        return {
            history : []
        }

    },

    created(){
        this.history = this.core.user.activity.history
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        grouped : function(){
          
            return f.group(this.filtered, (h) => {
                return h.type
            })

        },

        empty : function(){
            if(_.isEmpty(this.mixgrouped)) return true

            return null
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
            var h = this.history

            if (this.searchvalue){
                h = this.core.user.activity.search(this.searchvalue)
            }

            return h
        }
    }),

    methods : {
        reload : function(){

            this.history = this.core.user.activity.history
        },
        getmodule : function(item){

            if(item.type == 'portfolio') return portfolio
            if(item.type == 'portfoliopdf') return portfoliopdf
            if(item.type == 'client') return client
            if(item.type == 'lead') return client
            if(item.type == 'search') return search
            
            if (item.type == 'setting'){
                if(item.key == 'settingtheme') return themeToggle
            }

            return def
            
        },

        open : function(item){

            if (item.link){

                console.log('item.link', item.link)

                this.$router.push(item.link)

                this.$emit('close')
            }

            if (item.action){
                if (item.action.search){
                    this.$emit('search', item.action.search)
                }

                if (item.action.vueapi){
                    this.core.vueapi[item.action.vueapi](item.data)
                }

                
            }
        },

        to : function(path){
            this.$router.push(path)

            this.$emit('close')
        }
    },
}