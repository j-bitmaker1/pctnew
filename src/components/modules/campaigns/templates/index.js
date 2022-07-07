import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"
import preview from '../template/preview/index.vue';
export default {
    name: 'campaigns_templates',
    props: {
        select : Boolean,
        selected : String
    },

    components : {
        preview
    },

    data : function(){

        return {
            loading : false,
            templates : null,
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
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.templates, (template) => {
                    return (template.Name)
                })
            }
            else{
                return this.templates
            }
        },

        grouped : function(){

            return f.group(this.filtered, (f) => {
                return f.IsPublic ? "Public" : "Personal"
            })
        }

    }),

    methods : {
        search : function(v){
            this.searchvalue = v
        },

        load : function(){
            this.loading = true

            this.core.campaigns.getTemplates().then(r => {
                this.templates = _.toArray(r)
            }).finally(() => {
                this.loading = false
            })
        },

        open : function(template){

            if(this.select){
                this.$emit('success', template)
                this.$emit('close')
            }
            else{
                this.$router.push('/campaigns/template/' + template.Id)
            }

        },

        remove : function(){
            this.load()
        }
    },
}