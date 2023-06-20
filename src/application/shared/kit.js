import _ from "underscore"
import XLS from "../lib/pct/xls.js"

class Contact {
    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

        this.totalSum = 0

        if (data.__customfields__) {

            if (data.__customfields__.$$PCT_Capacity)
                this.capacity = Number(data.__customfields__.$$PCT_Capacity)

            if (data.__customfields__.$$PCT_Tolerance)
                this.tolerance = Number(data.__customfields__.$$PCT_Tolerance)

            if (data.__customfields__.$$PCT_CrashRating)
                this.riskscore = Number(data.__customfields__.$$PCT_CrashRating)

            if (data.__customfields__.$$PCT_QuestionnaireId)
                this.questionnaire = Number(data.__customfields__.$$PCT_QuestionnaireId)

            if (data.__customfields__.$$PCT_PortfoliosTotalSum)
                this.totalSum = Number(data.__customfields__.$$PCT_PortfoliosTotalSum)

        }

        //data.Products = (data.Products || "").split(',')

    }

    get imageLink() {
        if (this.AvatarId) {
            var imageid = this.AvatarId.split('.')[1]

            return 'https://rixtrema.net/api/crm/attachments/download/' + this.CompanyID + '/' + imageid
        }

        return ''

    }

}

class Portfolio {
    fields = [
        'catalogId',
        'crashRating',
        'created',
        'id',
        'isModel',
        'name',
        'positions',
        'positionsSum',
        'readOnly',
        'status',
        'updated',
        'userId',
        'advisorFee'
    ]

    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

        if(!this.advisorFee) this.advisorFee = 0

    }

    total = function () {

        if (!this.positions) return 0

        //if (this.isModel) return 100

        return _.reduce(this.positions, (m, p) => {

            return (p.isCovered || p.external || p.annuity_type) ? m + p.value : m

        }, 0)

    }

    uncovered = function () {
        return _.reduce(this.positions, (m, p) => {
            return !p.isCovered ? m + p.value : m
        }, 0)
    }

    joined = function () {
        var jg = {}

        _.each(this.positions, (a) => {
            if (!jg[a.ticker]) {
                jg[a.ticker] = a
            }
            else {
                jg[a.ticker].value += a.value
            }
        })

        return _.toArray(jg)
    }

    clone = function(){
        var data = {}

        _.each(this.fields, (i) => {
            data[i] = _.clone(this[i])
        })

        return new Portfolio(data)
    }

    has = function(ticker) {
        return _.find(this.positions, (asset) => {
            return asset.ticker == ticker
        }) ? true : false
    }

    get = function(ticker) {
        return _.find(this.joined(), (asset) => {
            return asset.ticker == ticker
        })
    }

    term = function(){
        return (_.find(this.positions, (asset) => {
            return asset.term
        }) || {}).term || null
    }

    exportXLS = function(save){
        var xls = new XLS()

        return xls.make('exportPortfolio', this, {
            name : (this.name).replace(/[^a-zA-Z0-9]/g, '') + '.xlsx',
            save
        })
    }
}

class Buylist {
    fields = [
        'created',
        'id',
        'name',
        'positions',
        'status',
        'updated',
        'userId',
    ]

    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

    }

    joined = function () {
        var jg = {}

        _.each(this.positions, (a) => {
            if (!jg[a.ticker]) {
                jg[a.ticker] = a
            }
            else {
               
            }
        })

        return _.toArray(jg)
    }

    clone = function(){
        var data = {}

        _.each(this.fields, (i) => {
            data[i] = _.clone(this[i])
        })

        return new Buylist(data)
    }

    has = function(ticker) {
        return _.find(this.positions, (asset) => {
            return asset.ticker == ticker
        }) ? true : false
    }

    exportXLS = function(save){
        var xls = new XLS()

        return xls.make('exportBuylist', this, {
            name : (this.name).replace(/[^a-zA-Z0-9]/g, '') + '.xlsx',
            save
        })
    }
}

class Task {
    constructor(data = {}) {

        this.appId = data.appId
        this.id = data.id
        this.userId = data.userId
        this.created = data.created || null //// TEMP
        this.processes = {}

        if (data.info){

            this.info = null
            
            try{
                var i = JSON.parse(data.info || "[]")
                this.info = i
            }catch(e){
                this.info = data.info
            }
        }


        var tempTask = {}


        tempTask.completed = data.completed || null
        tempTask.created = data.created || null
        tempTask.progress = data.progress || 0
        tempTask.status = data.status || "CREATED"
        tempTask.type = data.type

        if (data.dataManual || data.data){
            tempTask.data = null
        }

        if (data.dataManual){
            try{
                var d = JSON.parse(data.dataManual || "{}")
                tempTask.data = d.Infos || null
                tempTask.manual = true
            }catch(e){}
        }

        if(!tempTask.data)
            
            if (data.data){
                try{
                    var d = JSON.parse(data.data || "{}")
                    tempTask.data = d.Infos || []
                }catch(e){
                    tempTask.data = data.data
                }
            }

        this.processes[tempTask.type] = tempTask
    }
}

class TTask {
    constructor(data = {}) {

        this.completed = data.completed
        this.created = data.created
        this.error = data.error || null
        this.id = data.id
        this.fileId = data.fileId
        this.progress = data.progress
        this.status = data.status
        this.taskParameters = data.taskParameters || ''
        this.type = data.type
        this.userId = data.userId


        if (data.dataManual || data.data){
            this.data = null
        }

        if (data.dataManual){
            try{
                var d = JSON.parse(data.dataManual || "{}")
                this.data = d.Infos || null
                this.manual = true
            }catch(e){}
        }

        if(!this.data)
            
            if (data.data){
                try{
                    var d = JSON.parse(data.data || "{}")
                    this.data = d.Infos || []
                }catch(e){
                    this.data = data.data
                }
            }

   
        /*this.appId = data.appId
        this.id = data.id
        this.userId = data.userId
        this.created = data.created || null //// TEMP
        this.processes = {}

        if (data.info){

            this.info = null
            
            try{
                var i = JSON.parse(data.info || "[]")
                this.info = i
            }catch(e){
                this.info = data.info
            }
        }


        var tempTask = {}


        tempTask.completed = data.completed || null
        tempTask.created = data.created || null
        tempTask.progress = data.progress || 0
        tempTask.status = data.status || "CREATED"
        tempTask.type = data.type

        if (data.dataManual || data.data){
            tempTask.data = null
        }

        if (data.dataManual){
            try{
                var d = JSON.parse(data.dataManual || "{}")
                tempTask.data = d.Infos || null
                tempTask.manual = true
            }catch(e){}
        }

        if(!tempTask.data)
            
            if (data.data){
                try{
                    var d = JSON.parse(data.data || "{}")
                    tempTask.data = d.Infos || []
                }catch(e){
                    tempTask.data = data.data
                }
            }

        this.processes[tempTask.type] = tempTask*/
    }
}

class TFile {
    constructor(data = {}) {

        this.appId = data.appId
        this.id = data.id
        this.userId = data.userId
        this.created = data.created || null //// TEMP
        this.tasks = data.tasks

        if (data.info){

            this.info = null
            
            try{
                var i = JSON.parse(data.info || "[]")
                this.info = i
            }catch(e){
                this.info = data.info
            }
        }



    }
}

class Scenario {
    constructor(data = {}){
        _.each(data, (v, i) => {
            this[i] = v
        })


        this.custom = true
    }
}

export {
    Contact, Portfolio, Task, Scenario, Buylist, TFile, TTask
}