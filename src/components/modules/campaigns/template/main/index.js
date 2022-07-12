import { mapState } from 'vuex';

import status from '../../status/index.vue'
import f from "@/application/shared/functions.js"
export default {
    name: 'campaigns_template_main',
    props: {
        campaignTemplate : Object,
        wnd : Boolean
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
            

            var clone = this.campaignTemplate.clone()

                clone.Name = this.name
                clone.content = this.steps

            this.core.campaigns.campaignTemplates.validsteps(clone.content).then(r => {

                var promise = null

                if (clone.Id){
                    promise = this.core.campaigns.updateCampaignTemplate(clone.export())
                }
                else{
    
                    clone.Id = f.makeid()
    
                    console.log('clone', clone)
    
                    promise = this.core.campaigns.createCampaignTemplate(clone.export())
                }

                return promise

            }).then(r => {

                if(!this.wnd){
                    this.$router.replace('/campaigns/template/' + clone.Id).catch(e => {})
                }
                else{
                    this.$emit('close')
                }
                

            }).catch(e => {

                console.log("E", e)

                this.$store.commit('icon', {
                    icon: 'error',
                    message: e.error
                })

            })

            
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