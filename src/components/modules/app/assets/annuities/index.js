import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"

export default {
    name: 'assets_annuities',
    props: {
    },

    data : function(){

        return {
            loading : false,
            annuities : [],
            searchvalue : '',
        }

    },

    created () {
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        filtered : function(){
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.annuities, (annuity) => {
                    return (annuity.id + ' ' + annuity.annuity_type + ' ' + annuity.ueid)
                })
            }
            else{
                return this.annuities
            }
        },

        grouped : function(){

            return f.group(this.filtered, (f) => {
                return f.annuity_type
            })
        }
    }),

    methods : {
        search : function(v){
            this.searchvalue = v
        },
        load : function(){
            this.loading = true
            this.core.api.pctapi.stress.annuities.list().then(result => {
                this.annuities = result
            }).finally(() => {
                this.loading = false
            })
        },

        select : function(annuity){
            this.$emit('selected', annuity)
            this.$emit('close')
            
        }
    },
}