import { _ } from 'core-js';
import { mapState } from 'vuex';
import preview from '../template/preview/index.vue';
import f from '@/application/shared/functions.js'
import moment from 'moment-timezone'
import lineClientPreview from "@/components/modules/app/client/linepreview/index.vue"
import htmleditor from '@/components/common/htmleditor/index.vue'
export default {
    name: 'campaigns_start_single_email',
    props: {
        caption : String,
        body : String,
        profile : Object
    },

    components : {
        preview,
        lineClientPreview,
        htmleditor
    },

    data : function(){

        return {
            loading : true,

            template : null,
            templatechecked : false,
            templatechecking : false,
            list : null,
            contact : null,
            signatures : [],

            settings : {
                Started : null,
                TimeZone : moment.tz.guess(),
                SignatureId : "none"
            },

            m_caption : "",
            m_body : ""
        }

    },

    created() {

        this.m_caption = this.caption || ""
        this.m_body = this.body || ""
        this.contact = this.profile || null

        this.prepare()
    },

    watch: {
        template : function(){
        }
    },

    computed: mapState({
        auth : state => state.auth,
        testsettings : state => state.testsettings,
        valid : function(){
            return false
        },

        sticker : function(){

            if(!this.contactSelected){
                return 'user_envelope.png'
            }
            
            /*if(!this.template){
                return 'news.png'
            }*/

            

            return 'envelope_opened.png'
        },

        contactSelected : function(){
            return this.contact ? true : false
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
                id : 'Started',
                text : 'campaigns.fields.start.Send',
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

            if(_.toArray(this.signatures).length){
                m.push(signatureSelect)
            }

            return m
        },

        readyData : function(){

            var s = {
                settings : {}
            }

            if(this.settings.Started) {
                s.Started = f.date.toserverFormatDate(this.settings.Started)
            }

            var zr = moment.tz.zone(this.settings.TimeZone).parse(Date.UTC());
            var zl = moment.tz.zone(moment.tz.guess()).parse(Date.UTC());

            s.settings.TimeZone = ((zr - zl) / 60)
            s.settings.Platform = this.core.campaigns.mailsystem
            s.settings.GroupBy = "EMAIL"
            s.settings.SkipVerification = true

            s.Name = this.m_caption + " " + moment().format('MMMM/DD/YYYY')

            s.TemplateId = f.makeid()

            s.EmailTemplateInfo = {
                Body : encodeURIComponent(this.m_body),
                Subject : encodeURIComponent(this.m_caption)
            } 

            if(this.settings.SignatureId != 'none'){
                s.SignatureId = this.settings.SignatureId
            }

            s.CampaignsData = _.map([this.contact], (profile) => {
                return {
                    RecipientEmail : profile.Email,
                    RecipientName : f.name(profile.FName, profile.LName),
                    RecipientId : profile.ID
                }
            })


            return s

        },

        error : function(){
            if(!this.m_caption || !this.m_body){
                return 'email'
            }
            if(!this.contactSelected) return 'contact'

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

               
                    this.core.api.campaigns.batches.create(this.readyData, {
                        preloader : true,
                        showStatus : true
                    }).then(batch => {

                        this.$emit('success', batch.Id)

                        this.$emit('close')
                        
                        //this.$router.push('/campaigns/batch/' + batch.Id).catch(e => {})
                        
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

      

        scrollToRef : function(ref){

            setTimeout(() => {

                if(this.$refs[ref] ){
                    var v = this.$refs[ref].offsetTop - 117
                    this.$el.closest('.customscroll').scrollTop = v
                }
            }, 200)

            

        },

        

        selectcontacts : function(){

            var needscroll = _.isEmpty(this.contacts)

            this.core.vueapi.selectContacts((contacts) => {
                this.contact = contacts[0]

                if(needscroll) this.scrollToRef('template')

            },{
                one : true
            })
        },

        keyupSubject(evt) {
            this.core.campaigns.varhelper(evt.target, () => {
                //this.$refs['subject'].change()
                this.subject = evt.target.value
            })
        },

        keyupEditor(evt) {
            this.core.campaigns.varhelper(document.getSelection().focusNode, () => {
                this.$refs.htmleditor.sync()
            })
        },

      
    },
}