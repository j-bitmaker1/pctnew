const moment = require('moment');

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

    constructor({api}) {
        this.api = api.campaigns
        this.templates = null
    }

    getEmailTemplates(){

        if (this.templates){
            return Promise.resolve(this.templates)
        }

        return this.api.emails.templates.getall().then(r => {
            this.templates = {}

            _.each(r, (et) => {
                this.templates[et.ID] = et
            })

            return Promise.resolve(this.templates)
        })
    }

    getEmailTemplate(id){
        return this.getEmailTemplates().then(r => {
            return Promise.resolve(r[id])
        })
    }
}

module.exports = CampaignsManager;
