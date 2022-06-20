import { mapState } from 'vuex';

import activity from "@/components/common/activity/index.vue";
import _ from 'underscore';

export default {
    name: 'home_search',
    props: {
    },

    components : {
        activity
    },

    data : function(){

        return {
            loading : false,
            searchvalue : '',
            actions : {},
            fromsearch : {}
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        mix : function(){

            return {
                ...this.fromsearch,
                ...this.actions
            }

        }
    }),

    methods : {
        close : function(){
            this.$emit('close')
        },
        search : function(v){
            this.searchvalue = v
            this.actions = {}

            if (this.searchvalue){
                this.loading = true

                this.core.api.common.search(this.searchvalue).then(r => {

                    this.fromsearch = {}
                   
                    _.each(r, (objects, i) => {

                        if(objects.length){
                            this.fromsearch[i] = []

                            _.each (objects, (obj) => {
                                if (this.core.activity.templates[i]){

                                    var t = this.core.activity.templates[i](obj)

                                    t.index = i + t.key

                                    this.fromsearch[i].push(t)
                                }
                            })
                        }
                        
                    })

                }).finally(() => {
                    this.loading = false
                })

                var actions = this.core.activity.getactions(this.searchvalue)


                if(actions && actions.length){
                    this.actions = { }

                    _.each(actions, (a) => {
                        this.actions[a.type || "setting"] || (this.actions[a.type || "setting"] = [])

                        this.actions[a.type || "setting"].push(a)
                    })
                }

            }

            else{
                this.fromsearch = {}
            }
           
        },

        reload : function(){
            this.$refs.activity.reload()
        }
    },
}