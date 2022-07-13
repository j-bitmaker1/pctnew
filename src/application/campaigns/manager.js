const moment = require('moment');
import CampaignTemplates from "./templates"
import varhelper from "./varhelper";
import Variables from './variables'

import f from "@/application/shared/functions.js"

import {Signature} from './kit.js'

class CampaignsManager {

    statuses = {
        COMPLETED : {
            icon : "fas fa-check-circle",
            text : 'completed',
            statistic : 'CompletedCampaigns'
        },

        DELETED : {
            icon : "fas fa-trash",
            text : 'deleted',
            statistic : 'DeletedCampaigns'
        },

        PROCESSPAUSED : {
            icon : "fas fa-pause",
            text : 'paused',
            statistic : 'PauseCampaigns'
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

        PREPARED : {
            icon : "fas fa-spinner fa-spin",
            text : 'prepared'
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

    constructor(core, settings) {
        this.api = core.api.campaigns
        this.emailTemplates = null
        this.signatures = null
        this.templates = null
        this.vueapi = core.vueapi
        this.variables = Variables
        this.mailsystem = 'PCT'
        this.core = core
        this.campaignTemplates = new CampaignTemplates(this)
        this.settings = settings
    }

    varhelper(el){
        varhelper(el, (value, clbk) => {
            this.vueapi.searchVariable(value, clbk)
        })
    }

    ////

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

    getTemplates(){

        if (this.templates){
            return Promise.resolve(this.templates)
        }

        return this.api.templates.gets({Platforms : [this.mailsystem, "CRM"]}).then(r => {
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


    ////

    createEmailTemplate(data = {}){

        data.System = this.mailsystem
        data.Type = "Email"
        data.IsCommonTemplate = 0
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
                this.emailTemplates[r.Id] = r
            }

            return Promise.resolve(r)
        })
    }

    deleteEmailTemplate(Id){
        return this.api.emails.templates.delete(Id, {
            preloader : true,
            showStatus : true
        }).then(() => {
            if (this.emailTemplates){
                delete this.emailTemplates[Id]
            }

            return Promise.resolve()
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
            MailSystem : [this.mailsystem, 'CRM']
        }).then(r => {
            this.emailTemplates = {}

            _.each(r, (et) => {
                this.emailTemplates[Number(et.Id)] = et
            })

            return Promise.resolve(this.emailTemplates)
        })
    }

    getEmailTemplate(id){
        return this.getEmailTemplates().then(r => {

            if(!r[id]){
                return Promise.reject('Empty')
            }

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

    ////

    getSettings(){
        return this.settings.getall()
    }

    getSignatures(){

        if (this.signatures){
            return Promise.resolve(this.signatures)
        }

        return this.api.signatures.gets({
        }).then(r => {
  
            this.signatures = {}

            _.each(r, (et) => {
                this.signatures[et.Id] = et
            })

            return Promise.resolve(this.signatures)
        })
    }

    getSignature(id){
        return this.getSignatures().then(r => {

            console.log("R", r, id)

            if(!r[id]){
                return Promise.reject('Empty')
            }

            return Promise.resolve(r[id])
        })
    }

    getSignatureWithData(id){
        return this.getSignature(id).then(sig => {

            if(!sig) return Promise.reject()

            if (sig.html || sig.json){
                return Promise.resolve(sig)
            }

            return this.api.signatures.getdata(id).then(r => {
                sig.setData(r)

                return Promise.resolve(sig)
            })
        })
    }

    createSignature(signature){

        signature.System = this.mailsystem

        return this.api.signatures.create(signature.export(), {
            preloader : true,
            showStatus : true
        })

        .then(r => {

            if (this.signatures){
                this.signatures[signature.Id] = signature
            }

            return Promise.resolve(r)
        })
    }

    updateSignature(signature){
            
        return this.api.signatures.update(signature.export(), {
            preloader : true,
            showStatus : true
        })
    }

    deleteSignature(Id, System){
        return this.api.signatures.delete({Id, System}, {
            preloader : true,
            showStatus : true
        }).then(() => {

            if (this.signatures){
                delete this.signatures[Id]
            }

            return Promise.resolve()
        })
    }

    ////

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

    selectSignature(){
        return this.vueapi.customWindow(
            'campaigns_selectsignature', 
            "Select signature",
            {
                select : true
            }
        )
    }

    emailpreview(data){
        return this.vueapi.customWindow(
            'campaigns_emailpreview', 
            "", data, {}, {
                mclass : 'withoutheader'
            }
        ).catch(e => {})
    }

    exportEmailsStatistic(){
        return this.vueapi.customWindow(
            'export', 
            "Export emails statistic",
            {
                api : 'campaigns.misc.exportEmails',
                previewApi : 'campaigns.misc.emailsCount'
            }
        )
    }

    statusToStatistic(){
        
    }

    updateByWs(message){

        var batch = null
        var campaign = null

        var campaignupdate = {}
        var batchupdate = {}

        if (message.group_id || message.batch_id){
            batch = this.core.vxstorage.get(message.group_id || message.batch_id, 'batch')

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

                    if (nextstep && nextstep.Status && nextstep.Status == 'WAIT'){
                        

                        var nextupd = {
                            id : message.next_step,
                            status : 'ACTIVE',
                            started : f.date.toserverFormatDate()
                        }


                        this.core.vxstorage.update(nextupd, 'step')
        
                    }
                }
            }
        }


        if(!_.isEmpty(campaignupdate) && campaignupdate.Id){
            this.core.vxstorage.update(campaignupdate, 'campaign')
        }

        if(!_.isEmpty(batchupdate) && batchupdate.Id){
            this.core.vxstorage.update(batchupdate, 'batch')
        }

    }

   
    emptySignature(){
        return new Signature()
    }

}

export default CampaignsManager;
