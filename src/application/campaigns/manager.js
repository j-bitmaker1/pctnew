const moment = require('moment');
import CampaignTemplates from "./templates"
import varhelper from "./varhelper";
import Variables from './variables'
class CampaignsManager {

    statuses = {
        COMPLETED : {
            icon : "fas fa-check-circle",
            text : 'completed',
            statistic : 'CompletedCampaigns'
        },

        PAUSED : {
            icon : "fas fa-pause",
            text : 'paused',
            statistic : 'PauseCampaigns'
        },

        CANCELLED : {
            icon : "fas fa-stop",
            text : 'cancelled',
            statistic : 'ErrorCampaigns'
        },

        ACTIVE : {
            icon : "fas fa-spinner fa-spin",
            text : 'active',
            statistic : 'ActiveCampaigns'
        },

        PROCESS : {
            icon : "fas fa-spinner fa-spin",
            text : 'process',
            statistic : 'ActiveCampaigns'
        },

        COMPLETEDWITHERRORS : {
            icon : "fas fa-exclamation-circle",
            text : 'completedwitherrors' ,
            statistic : ''
        },

        PREPARING: {
            icon : "fas fa-spinner fa-spin",
            text : 'preparing' ,
            statistic : 'PreparingCampaigns'
        },

        VERIFICATION : {
            icon : "fas fa-spinner fa-spin",
            text : 'verification' ,
            statistic : 'VerificationCampaigns'
        },

        UNSUBSCRIBED: {
            icon : "fas fa-ban",
            text : 'unsubscribed' ,
            statistic : 'PreparingCampaigns'
        },

        PROCESSFAILED : {
            icon : "fas fa-exclamation-triangle",
            text : 'processfailed',
            statistic : 'ErrorCampaigns'
        },

        WAIT : {
            icon : "fas fa-clock",
            text : 'wait',
            statistic : 'WaitCampaigns'
        },

        READYTOPROCESS: {
            icon : "fas fa-clock",
            text : 'wait',
            statistic : 'WaitCampaigns'
        },

        default : {
            icon : "fas fa-question-circle",
            text : 'undefined',
            statistic : ''
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
        }).then(updated => {

            if (this.templates){
                this.templates[data.Id] = updated
            }

            return Promise.resolve(updated)
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
        ).catch(e => {})
    }

    edittemplate(data){
        return this.vueapi.customWindow(
            'campaigns_template', 
            "Edit template", data
        ).catch(e => {})
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

    statusToStatistic(){
        
    }

    updateByWs(message){

        console.log("UPDATE WS", message)

        var batch = null
        var campaign = null

        var campaignupdate = {}
        var batchupdate = {}

        if (message.group_id){
            batch = this.core.vxstorage.get(message.group_id, 'batch')

            if(batch)
                batchupdate.Id = batch.Id
        }

        if (message.campaign_id){
            campaign = this.core.vxstorage.get(message.campaign_id, 'campaign')

            if (campaign)
                campaignupdate.Id = campaign.Id
        }
        

        if(message.x_eventType == 'CAMPAIGNSTATUSCHANGED'){
            campaignupdate.Status = message.campaign_status

            //campaign_status_old

            if(batch){
                if(message.campaign_status && this.statuses[message.campaign_status] && this.statuses[message.campaign_status].statistic){
                    batchupdate[this.statuses[message.campaign_status].statistic] = (batch[this.statuses[message.campaign_status].statistic] || 0) + 1
                }

                if(message.campaign_status_old && this.statuses[message.campaign_status_old] && this.statuses[message.campaign_status_old].statistic && batch[this.statuses[message.campaign_status_old].statistic]){
                    batchupdate[this.statuses[message.campaign_status_old].statistic] = batch[this.statuses[message.campaign_status_old].statistic] - 1
                }
            }
            /*if(message.campaign_status == 'COMPLETED' && batch){
                batchupdate.CompletedCampaigns = batch.CompletedCampaigns + 1
            } */  
        }

        if(message.x_eventType == 'BATCHSTATUSCHANGED'){
            batchupdate.Status = message.batch_status
        }

        if (message.step_id){
            var step = this.core.vxstorage.get(message.step_id, 'step')

            if (step){

                var upd = {
                    id : message.step_id,
                    status : message.step_status,
                    started : message.step_activated
                }

                console.log("UPDATE WS STEP", upd)

                this.core.vxstorage.update(upd, 'step')

                

            }

            if (message.x_eventType == 'STEPCOMPLETED'){
                if (message.next_step){
                    var nextstep = this.core.vxstorage.get(message.next_step, 'step')

                    if (nextstep){

                        var nextupd = {
                            id : message.next_step,
                            status : 'ACTIVE',
                            started : f.date.toserverFormatDate()
                        }

                        console.log("UPDATE WS2 STEP", nextupd)

                        this.core.vxstorage.update(nextupd, 'step')
        
                    }
                }
            }
        }

        console.log("UPDATE WS2", campaignupdate, batchupdate)

        if(!_.isEmpty(campaignupdate) && campaignupdate.Id){
            this.core.vxstorage.update(campaignupdate, 'campaign')
        }

        if(!_.isEmpty(batchupdate) && batchupdate.Id){
            this.core.vxstorage.update(batchupdate, 'batch')
        }

    }


}

export default CampaignsManager;
