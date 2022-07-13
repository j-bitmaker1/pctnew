import _ from "underscore"
import f from "@/application/shared/functions.js"
import moment from 'moment'
class Campaign {
    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

    }

}

class Batch {
    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

    }
}


class Step {
    constructor(data = {}) {
        _.each(data, (v, i) => {
            this[i] = v
        })

        /*if (this.successSteps || this.success) {
            this.successSteps = _.map(this.success, (d) => {
                return new (this.CLASS || Step)(d)
            })
        }

        if (this.failedSteps || this.fail) {
            this.failedSteps = _.map(this.failedSteps || this.fail, (d) => {
                return new (this.CLASS || Step)(d)
            })
        }*/
    }

    timemode = function (step) {
        if (!step.day) return 'time'
        if (step.day > 7) return 'nextday'
        return 'day'
    }

    type = function () {
        if (this.template) return 'email'

        if (this.if) return 'ifstep'

        if (this.subcampaign) return 'subcampaign'

        //if (this.while) return 'whilestep'

        if (this.time || this.day) return 'wait'

        if (this.html) return 'html'

        if (this.notification) return 'notification'

        if (this.lead) return 'lead'
    }

    durationLabel = function(){

        var t = this.timeleft()

        if (t) return moment.duration(this.timeleft(), 'seconds').humanize(true);


        if(!this.day || this.day > 7) return moment.duration(this.duration(), 'seconds').humanize(true);

        var days = ['Monday', 'Tuesday', 'Wednesday','Thursday','Friday', 'Saturday', 'Sunday']

        var h = Math.floor(this.time / 3600)
        var m = Math.floor((this.time - h * 3600) / 60) 

        return days[this.day - 1] + " " + f.addZero(h) + ":" + f.addZero(m)

    }

    duration = function () {

        if (!this.day) return (this.time || 0) 

        if (!this.started) {

            if (this.day > 7) {
                var days = this.day - 8

                return (this.time || 0) + (days || 0) * 86400
            }

            if (this.day && this.day <= 7) {
                return (this.time || 0) + (7) * 86400
            }
        }

        else {

            var started = f.date.fromstring(this.started, true)
            var to = null

            if (this.day > 7) {
                var days = this.Day - 8

                to = f.date.addseconds(f.date.addDays(started, days), this.time)
            }

            if (this.day && this.day <= 7) {
                to = f.date.nextDateDayTime(f.date.convertDaysToNotmal(this.day), this.time)
            }

            return (to.getTime() - started.getTime()) / 1000

        }

    }

    timeleft = function () {
        if (!this.started || this.ended) return null

        return ((f.date.fromstring(this.started, true) / 1000) + this.duration()) - f.date.nowUtc1000()
    }

    completedTime = function () {
        if (!this.started) return 0
        if (this.ended) return this.duration()

        return f.date.nowUtc1000() - (f.date.fromstring(this.started, true) / 1000)

    }

    progress = function () {
        if (!this.started) return 0

        if (this.ended) return 1

        if (!this.duration()) return 1

        return 1 - Math.max(Math.min(this.timeleft() / this.duration(), 1), 0)
    }
}

class EditStep extends Step {

    constructor(data = {}) {

        var convertToStep = function(data){

            var importdata = {}
    
            if(data.template) importdata.template = Number(data.template)
            if(data.while) importdata.while = data.while
            if(data.time) importdata.time = data.time
            if(data.day) importdata.day = data.day
            if(data.notification) importdata.notification = data.notification
            if(data.lead) importdata.lead = data.lead
            if(data.subcampaign) importdata.subcampaign = data.subcampaign
    
            if(data.if){
                importdata.if = data.if
                importdata.mail = data.mail
                importdata.success = _.map(data.success, (d) => {
                    return new EditStep(d)
                })
    
                importdata.fail = _.map(data.fail, (d) => {
                    return new EditStep(d)
                })
            }
    
            return importdata
    
        }

        super(convertToStep(data))

        this.id = data.id
        this.status = ''

        this.CLASS = EditStep
    }

    clone = function(){
        return new EditStep(this)
    }

    export = function(){
        var data = {}

        if(this.template) data.template = this.template.toString()
        if(this.while) data.while = this.while
        if(this.time) data.time = this.time
        if(this.day) data.day = this.day
        if(this.notification) data.notification = this.notification
        if(this.lead) data.lead = this.lead
        if(this.subcampaign) data.subcampaign = this.subcampaign

        if(this.if){
            data.if = this.if
            data.mail = this.mail
            data.success = _.map(this.success, (d) => {
                return d.export()
            })

            data.fail = _.map(this.fail, (d) => {
                return d.export()
            })
        }

        data.id = this.id

        console.log("data", data, this)

        return data
    }
}

class ViewStep extends Step {

    constructor(data = {}) {

        var convertToStep = function(data){

            var importdata = {}
    
            if (data.Type == "SEND"){
                importdata.template = data.MailTemplateId

                importdata.track = data.TrackDt
            }
    
            if (data.Type == "WAIT"){
                importdata.time = data.Time
                importdata.day = data.Day
            }
    
            if (data.Type == "NOTIFY"){
                importdata.notification = data.Message
            }
    
            if (data.Type == "IF"){

                importdata.if = 'readed'
                importdata.mail = data.TrackStepId

                importdata.success = _.map(data.SuccessSteps, (d) => {
                    return new ViewStep(d)
                })
    
                importdata.fail = _.map(data.FailedSteps, (d) => {
                    return new ViewStep(d)
                })
    
            }
    
            if (data.Type == "WHILE"){
                importdata.time = data.Time
                importdata.day = data.Day
                importdata.while = data.TrackStepId
            }

            if (data.Type == "ADDLEAD"){
                importdata.lead = true
            }
    
            return importdata
    
        }
        
        super(convertToStep(data))

        this.status = data.Status
        this.campaignId = data.CampaignId

        this.created = data.Created
        this.ended = data.Ended
        this.started = data.Started
        this.id = data.Id

        this.CLASS = ViewStep
    }
}

class Template {
    constructor(data = {}) {
        _.each(data, (v, i) => {
            this[i] = v
        })


        this.content = []
        this.version = 2
        
        if(!this.Name) this.Name = ''

        this.setInfo(this.Info)

        this.content = _.map(this.content, (c) => {
            return new EditStep(c)
        })

    }

    setInfo = function(info){
        if(info){
            try {
                var cjs = JSON.parse(info)
    
                this.version = cjs.version || 2
    
                if (cjs.version == 2) {
                    this.content = JSON.parse(f.hexDecode(cjs.c))
                }
    
            } catch (e) { 
                console.error(e, info)
            }
        }
        
        
    }

    canedit = function(){
        return !this.IsPublic
    }

    clone = function(){
        var t = new Template()

        t.content = _.map(this.content, (c) => {
            return c.clone()
        })

        t.version = this.version
        t.Name = this.Name
        t.Id = this.Id
        t.IsPublic = this.IsPublic
        t.Path = this.Path
        t.Platform = this.Platform

        return t
    }

    export = function(){
        var data = {
            Name : this.Name,
            Id : this.Id,
            IsPublic : this.IsPublic,
            Path : this.Path,
            Platform : this.Platform,

            Info : JSON.stringify({
                version : this.version,
                c : f.hexEncode(JSON.stringify(_.map(this.content, (c) => {
                    return c.export()
                })))
            })
        }

        return data
    }
}

class Signature {
    constructor(data = {}) {

        /*{
            "Id": "",
            "System": "",
            "Type": "",
            "Name": "",
            "Json": "",
            "Html": ""
        }*/

        _.each(data, (v, i) => {
            this[i] = v
        })


        

        this.setData({
            html : data.Html,
            json : data.JSON
        })
        
    }

    setData(r = {}){

        console.log("R", r)

        if(r.html){
            try{
                this.Html = f.Base64.decodeUnicode(r.html)
            }catch(e){
                this.Html = ''//r.html
            }
        }

        if(r.json){
            try{
                this.Json = JSON.parse(f.Base64.decodeUnicode(r.json))
            }catch(e){
                this.Json = {}
            }
        }
        
    }

    export(){
        var d = {
            Id : this.Id,
            System : this.System,
            Type : this.Type,
            Name : this.Name,
            Json : this.Json
        }

        if(this.Json){
            d.Json = f.Base64.encodeUnicode(JSON.stringify(this.json))
        }

        if(this.Html){
            d.Html = f.Base64.encodeUnicode(this.Html)
        }

        return d
    }

    clone(){
        return new Signature(this.export())
    }
}

class EmailTemplate {
    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

        this.COMPLETED = Number(data.COMPLETED || '0')

        if (data.Id)
            this.Id = Number(data.Id)

        this.LINKSVISITED = Number(data.LINKSVISITED || '0')
        this.OPENED = Number(data.OPENED || '0')
        this.UNSUBSCRIBED = Number(data.UNSUBSCRIBED || '0')

        if (data.Subject){
            this.setSubject(data.Subject)
        }

        if (data.Body){
            this.setBody(data.Body)
        }
    }

    setSubject = function(subject){
        try{
            this.Subject = decodeURIComponent(subject)
        }catch(e){
            this.Subject = subject
        }
        
    }

    setBody = function(body){

        try{
            this.Body = decodeURIComponent(body)
        }catch(e){
            this.Body = body
        }
        
    }
}

export {
    Campaign, Batch, Step, EditStep, ViewStep, Template, EmailTemplate, Signature
}