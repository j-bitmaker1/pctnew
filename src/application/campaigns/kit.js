import _ from "underscore"
import f from "@/application/shared/functions.js"

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

        if (this.SuccessSteps){
            this.SuccessSteps = _.map(this.SuccessSteps, (d) => {
                return new Step(d)
            })
        }

        if (this.FailedSteps){
            this.FailedSteps = _.map(this.FailedSteps, (d) => {
                return new Step(d)
            })
        }

        /*if(this.OPENED == '1') this.OPENED = true
        if(this.OPENED == '0') this.OPENED = false

        if(this.LINKSVISITED == '1') this.LINKSVISITED = true
        if(this.LINKSVISITED == '0') this.LINKSVISITED = false

        if(this.UNSUBSCRIBED == '1') this.UNSUBSCRIBED = true
        if(this.UNSUBSCRIBED == '0') this.UNSUBSCRIBED = false*/
    }

    duration = function(){
        return (this.Time || 0) + (this.Day || 0) * 86400
    }

    timeleft = function(){
        if(!this.Started || this.Ended) return null

        return ((f.date.fromstring(this.Started, true) / 1000) + this.duration()) - f.date.nowUtc1000()
    }

    progress = function(){
        if(!this.Started) return 0

        if(this.Ended) return 1

        if(!this.duration()) return 1

        return this.timeleft() / this.duration()
    }
}

class Template {
    constructor(data = {}) {
        _.each(data, (v, i) => {
            this[i] = v
        })
    }
}

class EmailTemplate{
    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

        this.COMPLETED = Number(data.COMPLETED)
        this.ID = Number(data.ID)

        this.LINKSVISITED = Number(data.LINKSVISITED)
        this.OPENED = Number(data.OPENED)

        this.UNSUBSCRIBED = Number(data.UNSUBSCRIBED)

        try{
            this.Subject = decodeURIComponent(data.Subject)
        }catch(e){}
        

    }
}

export {
    Campaign, Batch, Step, Template, EmailTemplate
}