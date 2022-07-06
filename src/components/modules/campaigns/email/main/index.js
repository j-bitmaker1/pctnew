import { mapState } from 'vuex';

import f from "@/application/shared/functions.js"

import htmleditor from '@/components/common/htmleditor/index.vue'

export default {
    name: 'campaigns_template_main',
    props: {
        emailTemplate : Object
    },

    components : {
        htmleditor
    },
    data : function(){

        return {
            prev : '',
            name : '',
            subject : '',
            body : ''
        }

    },

    created() {
        this.name = this.emailTemplate.Name || ""
        this.subject = this.emailTemplate.Subject || ""
        this.body = this.emailTemplate.Body || ""

        console.log('this.emailTemplate', this.emailTemplate)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        valid : function(){

            console.log('this.body', this.body)

            if(this.name && this.subject && this.body) return true

            return false
        },
        haschanges : function(){
            return this.name != this.emailTemplate.Name || 
                this.subject != this.emailTemplate.Subject || 
                this.body != this.emailTemplate.Body
        },
        auth : state => state.auth
    }),

    methods : {

        save : function(){

            var promise = null

            if (this.emailTemplate.ID){
                promise = this.core.campaigns.updateEmailTemplate({
                    Name : this.name,
                    Subject : this.Subject,
                    Body : this.Body,
                    ID : this.emailTemplate.ID
                })
            }
            else{
                promise = this.core.campaigns.createEmailTemplate({
                    Name : this.name,
                    Subject : this.Subject,
                    Body : this.Body,
                    ID : this.emailTemplate.ID
                }).then(r => {
                    this.$router.replace('/campaigns/emailtemplate/' + r.ID)
                })
            }

            
        },
        cancel : function(){

            if(!this.haschanges){

                this.close()
                return
            }

            return vm.$dialog.confirm(
                vm.$t('campaigns.labels.emailTemplateCancel'), {
                okText: vm.$t('yes'),
                cancelText : vm.$t('no')
            })
    
            .then((dialog) => {

                this.name = this.emailTemplate.Name
                this.subject = this.emailTemplate.Subject
                this.body = this.emailTemplate.Body

            })
            
        },

        close : function(){
            this.$emit('close')
        },

        keyupSubject(evt) {
            this.core.campaigns.varhelper(evt.target)
        },
        keyupEditor(evt) {
            this.core.campaigns.varhelper(document.getSelection().focusNode)
        },
    },
}