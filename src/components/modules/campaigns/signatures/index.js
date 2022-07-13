import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"
import preview from '../signature/preview/index.vue';
export default {
    name: 'campaigns_signatures',
    props: {
        select : Boolean,
        selected : Number
    },

    components : {
        preview
    },

    data : function(){

        return {
            loading : false,
            signatures : null,
            searchvalue : '',
        }

    },

    created() {
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        filtered : function(){

            console.log('this.signatures', this.signatures)
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.signatures, (template) => {
                    return (signature.Name)
                })
            }
            else{
                return this.signatures
            }
        },

        sorted : function(){
     
            return _.sortBy(this.filtered, (t) => {

                var d = Number(t.Modified || t.Created || 0)

                if(t.Email) return -10 * d

                return -1 * d
            })
        }

    }),

    methods : {
        search : function(v){
            this.searchvalue = v
        },

        load : function(){
            this.loading = true

            this.core.campaigns.getSignatures().then(r => {
                this.signatures = _.toArray(r)
            }).finally(() => {
                this.loading = false
            })
        },

        open : function(signature){
            if(this.select){
                this.$emit('success', signature)
                this.$emit('close')
            }
            else{
                this.$router.push('/signature/' + signature.Id).catch(e => {})
            }
            
        },

        deleted : function(item){
            this.load()
        }
    },
}