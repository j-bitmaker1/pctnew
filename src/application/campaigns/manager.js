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

    constructor(core) {
        this.api = core.api.campaigns
        this.emailTemplates = null
        this.templates = null
        this.vueapi = core.vueapi
        this.variables = Variables
        this.mailsystem = 'PCT'
        this.core = core

        this.campaignTemplates = new CampaignTemplates(this)
    }

    varhelper(el){
        varhelper(el, (value, clbk) => {
            this.vueapi.searchVariable(value, clbk)
        })
    }

    createCampaignTemplate(data = {}){
        return this.api.templates.add(data, {
            preloader : true,
            showStatus : true
        }).then(r => {

            if (this.templates){
                this.templates[r.Id] = r
            }

            return Promise.resolve(r)
        })
    }

    removeCampaignTemplate(data = {}){
        console.log("D", data, this.api.templates.remove)
        return this.api.templates.remove(data, {
            preloader : true,
            showStatus : true
        }).then(r => {

            if (this.templates){
                delete this.templates[data.Id]
            }

            return Promise.resolve(r)
        })
    }

    updateCampaignTemplate(data = {}){
        return this.api.templates.update(data, {
            preloader : true,
            showStatus : true
        })
    }

    createEmailTemplate(data = {}){

        data.MailSystem = this.mailsystem
        data.Type = "Email"
        data.CommonTemplate = 0
        data.Email = ''

        if (data.Body)
            data.Body = encodeURIComponent(data.Body)

        return this.core.user.getinfo().then(r => {

            data.Email = r.Email

            return this.api.emails.templates.create(data, {
                preloader : true,
                showStatus : true
            })

        }).then(r => {

            if (this.emailTemplates){
                this.emailTemplates[r.ID] = r
            }

            return Promise.resolve(r)
        })
    }

    updateEmailTemplate(data){

        if (data.Body)
            data.Body = encodeURIComponent(data.Body)
            
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

        return this.api.templates.gets({Platforms : [this.mailsystem]}).then(r => {
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

    start(){
        return this.vueapi.customWindow(
            'campaigns_start', 
            "New campaign"
        )
    }

    selectTemplate(selected){
        return this.vueapi.customWindow(
            'campaigns_selecttemlpate', 
            "Select template",
            {
                select : true,
                selected
            }
        )
    }
}

export default CampaignsManager;
