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
            loading : true,

            template : null,
            templatechecked : false,
            templatechecking : false,
            list : null,
            contacts : [],
            signatures : [],

            settings : {
                Started : null,
                Name : '',
                TimeZone : moment.tz.guess(),
                GroupBy : "EMAIL",
                SignatureId : "none"
            }
        }

    },

    created() {
        this.prepare()
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

            var signatureSelect = {
                id : 'SignatureId',
                text : 'campaigns.fields.start.SignatureId',
                input : 'select',
                
                values : [{
                    value : "none",
                    text : "Without signature"
                }].concat(_.map(this.signatures, (s => {
                    return {
                        value : s.Id,
                        text : s.Name
                    }
                }))),
               
                rules : []
            }

            var m = [{
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
            },{
                id : 'GroupBy',
                text : 'campaigns.fields.start.GroupBy',
                input : 'select',
                values : [{
                    value : 'INORDER',
                    text : 'campaigns.fields.start.INORDER'
                },{
                    value : 'EMAIL',
                    text : 'campaigns.fields.start.EMAIL'
                }],
                rules : [{
                    rule : 'required'
                }]
            }]

            if(_.toArray(this.signatures).length){
                m.push(signatureSelect)
            }

            return m
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
            s.settings.GroupBy = this.settings.GroupBy

            s.Name = this.settings.Name
            s.TemplateId = this.template.Id

            if(this.settings.SignatureId != 'none'){
                s.SignatureId = this.settings.SignatureId
            }

            s.CampaignsData = _.map(this.contacts, (profile) => {
                return {
                    RecipientEmail : profile.Email,
                    RecipientName : f.name(profile.FName, profile.LName),
                    RecipientId : profile.ID
                }
            })

            console.log("S", s)

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
        prepare : function(){
            this.loading = true

            this.core.campaigns.getSignatures().then(r => {

                this.signatures = r

                return this.core.campaigns.getSettings()

            }).then(r => {

                if (r.signature.value && _.find(this.signatures, (s)=>{
                    return s.Id == r.signature.value
                })){    

                    this.$set(this.settings, 'SignatureId', r.signature.value)
                }

            }).finally(() => {
                this.loading = false
            })
        },
        schange : function(v){
            this.settings = v
        },
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

                        /*this.$store.commit('globalpreloader', true)

                        setTimeout(() => {
                            this.$store.commit('globalpreloader', false)*/
                            this.$emit('close')
                            this.$router.push('/campaigns/batch/' + batch.Id).catch(e => {})
                        /*}, 2000)*/

                        
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
            }).catch(e => {}).finally(() => {
                this.templatechecking = false
            })
        },

        scrollToRef : function(ref){

            setTimeout(() => {

                if(this.$refs[ref] ){
                    var v = this.$refs[ref].offsetTop - 117
                    this.$el.closest('.customscroll').scrollTop = v
                }
            }, 200)

            

        },

        selecttemplate : function(){
            this.core.campaigns.selectTemplate(this.template ? this.template.Id : null).then(t => {
                this.template = t

                this.setName()

                this.scrollToRef('recipients')

            }).catch(e => {
                console.error(e)
            })
        },

        selectcontacts : function(){

            var needscroll = _.isEmpty(this.contacts)

            this.core.vueapi.selectContacts((contacts) => {
                this.contacts = contacts

                if(needscroll) this.scrollToRef('settings')

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