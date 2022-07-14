import { mapState } from 'vuex';
import f from '@/application/shared/functions.js'

import variable from './variable/index.vue'

export default {
    name: 'campaigns_variables',
    props: {
        value : String,
        onlysearch : Boolean
    },

    components : {
        variable
    },

    data : function(){

        return {
            loading : false,
            searchvalue : '',
            variables : null,
            tipposition : 0
        }

    },

    created : function(){
        this.load()

        if (this.value) {
            this.searchvalue = this.value
        }

        setTimeout(() => {
            this.$refs.search.focus()
        }, 200)


    },

    watch: {
        filtered : function(){
            this.setTipPosition()
        }
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        filtered : function(){
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.variables, (variable) => {
                    return variable.Name + ' ' + variable.Id
                })
            }
            else{

                if(this.onlysearch){
                    return []
                }

                return this.variables
            }
        },

        filteredcnt : function(){

            if (this.onlysearch){
                return _.first(this.filtered, 7)
            }

        },

        grouped : function(){

            return f.group(this.filteredcnt, (variable) => {
                return variable.Group || "General"

            })
        }
    }),

    methods : {

        load : function(){
            this.loading = true
            this.core.campaigns.getvariables().then(variables => {

                this.variables = variables

            }).finally(() => {

                this.loading = false

            })
        },

        search : function(v){

            this.searchvalue = v
           
        },

        setTipPosition : function(v){

            if(typeof v != 'undefined') this.tipposition = v

            if(this.tipposition >= this.filtered.length) this.tipposition = this.filtered.length - 1

            if(this.tipposition < 0) this.tipposition = 0
            
        },

        select : function(variable){
            this.$emit("close")

            this.$emit("selected", variable.Id)
        },

        controlKey : function(key){
            if(!this.filtered.length) return

            if (key == 'up')
                this.setTipPosition(this.tipposition - 1)

            if (key == 'down')
                this.setTipPosition(this.tipposition + 1)

            if (key == 'enter')
                this.select(this.filtered[this.tipposition])
        },
    },
}