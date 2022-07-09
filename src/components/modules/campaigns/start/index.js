import { _ } from 'core-js';
import { mapState } from 'vuex';
import preview from '../template/preview/index.vue';
import f from '@/application/shared/functions.js'
import moment from 'moment-timezone'
import lineClientPreview from "@/components/modules/app/client/linepreview/index.vue"

export default {
    name: 'campaigns_start',
    props: {
    },

    components : {
        preview,
        lineClientPreview
    },

    data : function(){

        return {
            loading : false,

            template : null,
            templatechecked : false,
            templatechecking : false,
            list : null,
            contacts : [],

            settings : {
                Started : null,
                Name : '',
                TimeZone : moment.tz.guess()
            }
        }

    },

    created : () => {

    },

    watch: {
        template : function(){
            this.checkTemplate().catch()
        }
    },
    computed: mapState({
        auth : state => state.auth,
        valid : function(){
            return false
        },

        sticker : function(){
            if(!this.template){
                return 'news.png'
            }

            if(!this.contactsSelected){
                return 'bar-chart.png'
            }

            return 'settings.png'
        },

        contactsSelected : function(){
            return _.toArray(this.contacts).length
        },

        contactsLabels : function(){
            return _.map(this.contacts, (c) => {
                return f.name(c.FName, c.LName) + " <"+c.Email+">"
            }).join(", ")
        },

        contactsGrouped : function(){
            return f.group(this.contacts, (f) => {
                return f.Type
            })
        },

        settingsFields : function(){
            return [{
                id : 'Name',
                text : 'campaigns.fields.start.Name',
                rules : [{
                    rule : 'required'
                }]
            },{
                id : 'Started',
                text : 'campaigns.fields.start.Started',
                input : 'date',
                type : 'datetime-local',
                rules : [],

                options : {
                    min : new Date()
                }
            },{
                id : 'TimeZone',
                text : 'campaigns.fields.start.RecipientTimeZone',
                input : 'timezone',
                rules : [{
                    rule : 'required'
                }]
            }]
        },

        readyData : function(){

            var s = {
                settings : {}
            }

            if(this.settings.Started) s.settings.Started = f.date.toserverFormatDate(this.settings.Started)

            var zr = moment.tz.zone(this.settings.TimeZone).parse(Date.UTC());
            var zl = moment.tz.zone(moment.tz.guess()).parse(Date.UTC());

            s.settings.TimeZone = ((zr - zl) / 60)
            s.settings.Platform = this.core.campaigns.mailsystem
            s.settings.GroupBy = 'EMAIL'

            s.Name = this.settings.Name
            s.TemplateId = this.template.Id

            s.CampaignsData = _.map(this.contacts, (profile) => {
                return {
                    RecipientEmail : profile.Email,
                    RecipientName : f.name(profile.FName, profile.LName),
                    RecipientId : profile.ID
                }
            })

            return s

        },

        error : function(){
            if(!this.template) return 'template'
            if(!this.settings.Name) return 'name'
            if(!this.contactsSelected) return 'contacts'

            return null
        }


    }),

    methods : {
        start : function(){

            if(!this.error){

                this.checkTemplate().catch(e => {

                    this.$store.commit('icon', {
                        icon: 'error',
                        message: this.$t("campaigns.errors.start.templateFail")
                    })



                }).then(() => {

                    this.core.api.campaigns.batches.create(this.readyData, {
                        preloader : true,
                        showStatus : true
                    }).then(batch => {

                        this.$store.commit('globalpreloader', true)

                        setTimeout(() => {
                            this.$store.commit('globalpreloader', false)
                            this.$emit('close')
                            this.$router.push('/campaigns/batch/' + batch.Id)
                        }, 2000)

                        
                    })

                })

                
            }
            else{
                this.$store.commit('icon', {
                    icon: 'error',
                    message: this.$t("campaigns.errors.start." + this.error)
                })
            }
            
        },
        cancel : function(){
            this.$emit('close')
        },

        checkTemplate : function(){

            if(!this.template){
                return Promise.reject()
            }

            this.templatechecked = false
            this.templatechecking = true

            return this.core.campaigns.campaignTemplates.validsteps(this.template.content).then(r => {
                this.templatechecked = true
            }).finally(() => {
                this.templatechecking = false
            })
        },

        selecttemplate : function(){
            this.core.campaigns.selectTemplate(this.template ? this.template.Id : null).then(t => {
                this.template = t

                this.setName()

                

            }).catch(e => {
                console.error(e)
            })
        },

        selectcontacts : function(){
            this.core.vueapi.selectContacts((contacts) => {
                this.contacts = contacts

                this.setName()
            },{
                selected : this.contacts
            })
        },

        setName : function(){

            var ps = []

            if(this.template) ps.push(this.template.Name)

            ps.push(moment().format('MMMM/DD/YYYY'))

            if (this.settings.Name) {
                ps.push(this.contactsSelected + " recipient(s)")
            }

            this.settings.Name = ps.join(", ")

        },

        edittemplate : function(){

            this.core.campaigns.edittemplate({
                campaignTemplate : this.template
            })
            
        }
    },
}