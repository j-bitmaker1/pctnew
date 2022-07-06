const moment = require('moment');
import CampaignTemplates from "./templates"
import varhelper from "./varhelper";
import Variables from './variables'

class CampaignsManager {


    statuses = {
        COMPLETED : {
            icon : "fas fa-check-circle",
            text : 'completed',
        },

        ACTIVE : {
            icon : "fas fa-spinner fa-spin",
            text : 'active'
        },

        PROCESS : {
            icon : "fas fa-spinner fa-spin",
            text : 'process'
        },

        WAIT : {
            icon : "fas fa-clock",
            text : 'wait'
        },

        default : {
            icon : "fas fa-question-circle",
            text : 'undefined'
        }
    }

    constructor({api, vueapi}) {
        this.api = api.campaigns
        this.emailTemplates = null
        this.templates = null
        this.vueapi = vueapi
        this.variables = Variables
        this.mailsystem = 'pct'

        this.campaignTemplates = new CampaignTemplates(this)
    }

    varhelper(el){
        varhelper(el, (value, clbk) => {
            this.vueapi.searchVariable(value, clbk)
        })
    }

    createEmailTemplate(data = {}){

        data.MailSystem = this.mailsystem
        data.Type = "Email"
        data.CommonTemplate = 0
        data.Email = ''

        if (data.Body)
            data.Body = encodeURIComponent(data.Body)
        
        return this.api.emails.templates.create(data, {
            preloader : true,
            showStatus : true
        }).then(r => {

            if (this.emailTemplates){
                this.emailTemplates[r.ID] = r
            }

            return Promise.resolve(r)
        })
    }

    updateEmailTemplate(data){
        return this.api.emails.templates.update(data, {
            preloader : true,
            showStatus : true
        })
    }

    getEmailTemplates(){

        if (this.emailTemplates){
            return Promise.resolve(this.emailTemplates)
        }

        return this.api.emails.templates.getall({
            MailSystem : this.mailsystem
        }).then(r => {
            this.emailTemplates = {}

            _.each(r, (et) => {
                this.emailTemplates[Number(et.ID)] = et
            })

            return Promise.resolve(this.emailTemplates)
        })
    }

    getEmailTemplate(id){
        return this.getEmailTemplates().then(r => {

            return Promise.resolve(r[id])
        })
    }

    getEmailWithBody(id){
        return this.getEmailTemplate(id).then(tpl => {

            if(!tpl) return Promise.reject()

            if (tpl.Body){
                return Promise.resolve(tpl)
            }

            return this.api.emails.templates.getBody(id).then(body => {
                tpl.setBody(body)

                return Promise.resolve(tpl)
            })
        })
    }

    getTemplates(){

        if (this.templates){
            return Promise.resolve(this.templates)
        }

        return this.api.templates.gets({MailSystem : this.mailsystem}).then(r => {
            this.templates = {}

            _.each(r.Records, (et) => {
                this.templates[et.Id] = et
            })

            return Promise.resolve(this.templates)
        })
    }

    getTemplate(id){
        return this.getTemplates().then(r => {
            return Promise.resolve(r[id])
        })
    }
}

export default CampaignsManager;
