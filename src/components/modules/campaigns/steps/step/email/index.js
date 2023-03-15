import { mapState } from 'vuex';
import smeta from '../meta/index.vue'
export default {
    name: 'campaign_step_email',
    props: {
        step : Object,
        editing : Boolean,
        campaign : Object
    },

    components : {
        smeta
    },

    data : function(){

        return {
            loading : true,
            template : null
        }

    },

    created() {
        //this.load()
    },

    watch: {
        templateId : {
            immediate : true,
            handler : function(){
                this.load()
            }
        }
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        templateId : function(){
            return this.step.template
        }
    }),

    methods : {
        load : function(){
            this.loading = true

            this.core.campaigns.getEmailTemplate(this.step.template).then(r => {

                this.template = r
            }).finally(() => {
                this.loading = false
            })
        },

        showemail : function(){
            this.core.api.campaigns.single.email(this.campaign.Id, this.step.id, {
                preloader : true
            }).then(r => {

                this.core.api.crm.contacts.get(this.campaign.RecipientId, {
                    preloader : true
                }).then(profile => {

                    this.core.campaigns.emailpreview({
                        ...r,
                        ... {
                            date : this.step.started,
    
                        },
                        ...{
                            email : this.campaign.RecipientEmail,
                            name : this.campaign.RecipientName,
                            profile : profile,
                            read : this.step.track
                        }
                    })

                })

                

            })
        }
    },
}