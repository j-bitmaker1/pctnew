import { mapState } from 'vuex';

import status from '../../status/index.vue'
import f from "@/application/shared/functions.js"
export default {
    name: 'campaigns_template_main',
    props: {
        campaignTemplate : Object
    },

    components : {
        status
    },
    data : function(){

        return {
            steps : [],
            prev : '',
            name : ''
        }

    },

    created() {
        this.ini()
        console.log('this.campaignTemplate', this.campaignTemplate)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        haschanges : function(){
            return JSON.stringify(this.steps) != this.prevsteps || this.name != this.campaignTemplate.Name
        },
        valid : function(){
            return this.name && this.steps.length
        },
        auth : state => state.auth
    }),

    methods : {
        ini : function(){
            this.prevsteps = JSON.stringify(this.campaignTemplate.content)
            this.steps = this.core.campaigns.campaignTemplates.clonelist(this.campaignTemplate.content)
            this.name = this.campaignTemplate.Name
        },
        change : function(steps){
            this.steps = steps
        },

        save : function(){
            var promise = null

            var clone = this.campaignTemplate.clone()

                clone.Name = this.name
                clone.content = this.steps

            if (clone.Id){
                promise = this.core.campaigns.updateCampaignTemplate(clone.export())
            }
            else{

                clone.Id = f.makeid()

                console.log('clone', clone)

                promise = this.core.campaigns.createCampaignTemplate(clone.export()).then(r => {
                    this.$router.replace('/campaigns/template/' + r.Id)
                })
            }
        },
        cancel : function(){

            this.$dialog.confirm(
                this.$t('campaigns.labels.templateCancel'), {
                okText: 'Yes',
                cancelText : 'No'
            })
    
            .then((dialog) => {

                this.ini()

            }).catch( e => {
                
            })

            
        }
    },
}