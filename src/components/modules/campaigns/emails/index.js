import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"
import preview from '../email/preview/index.vue';
export default {
    name: 'emails_templates',
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
                    return (template.Name) + " " + template.Subject
                })
            }
            else{
                return this.templates
            }
        },

        sorted : function(){
            return _.sortBy(this.filtered, (t) => {

                var d = Number(t.Modified || t.Created || 0)


                if(t.Email) return -10 * d

                return -1 * d
            })
        },

        grouped : function(){

            return f.group(this.sorted, (t) => {

                if (t.Email) return 'my'

                if (t.Path === 'jtCampaigns') return 'jt';
                if (t.Path === 'rpagCampaigns') return 'rpag';
                if (t.Path === 'financialLiteracy') return 'financialLiteracy';
                if (t.Path === 'financialAwareness') return 'financialAwareness';
                if (t.Path === 'pooledEmployerA') return 'pooledEmployerA';
                if (t.Path === 'pooledEmployerB') return 'pooledEmployerB';

                return 'common'

            })
        }

    }),

    methods : {
        search : function(v){
            this.searchvalue = v
        },

        load : function(){
            this.loading = true

            this.core.campaigns.getEmailTemplates().then(r => {
                this.templates = _.toArray(r)
            }).finally(() => {
                this.loading = false
            })
        },

        open : function(template){
            if(this.select){
                this.$emit('select', template)
                this.$emit('close')
            }
            else{
                this.$router.push('/campaigns/emailtemplate/' + template.Id).catch(e => {})
            }
            
        },

        deleted : function(item){
            this.load()
        }
    },
}