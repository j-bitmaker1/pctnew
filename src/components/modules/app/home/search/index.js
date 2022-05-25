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
    }),

    methods : {
        close : function(){
            this.$emit('close')
        },
        search : function(v){
            this.searchvalue = v

            if (this.searchvalue){
                this.loading = true
                this.core.api.common.search(this.searchvalue).then(r => {

                    this.fromsearch = {}
                   

                    _.each(r, (objects, i) => {

                        if(objects.length){
                            this.fromsearch[i] = []

                            _.each (objects, (obj) => {
                                if (this.core.user.activity.templates[i]){

                                    var t = this.core.user.activity.templates[i](obj)

                                    t.index = i + t.key

                                    this.fromsearch[i].push(t)
                                }
                            })
                        }
                        
                    })
                }).finally(() => {
                    this.loading = false
                })

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