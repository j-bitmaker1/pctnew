const moment = require('moment');
import CampaignTemplates from "./templates"

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


        this.campaignTemplates = new CampaignTemplates(this)
    }

    getEmailTemplates(){

        if (this.emailTemplates){
            return Promise.resolve(this.emailTemplates)
        }

        return this.api.emails.templates.getall().then(r => {
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

    getTemplates(){

        if (this.templates){
            return Promise.resolve(this.templates)
        }

        return this.api.templates.gets().then(r => {
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
