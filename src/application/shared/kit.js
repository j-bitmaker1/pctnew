import _ from "underscore"
import XLS from "../lib/pct/xls"

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

class Task {
    constructor(data = {}) {

        this.appId = data.appId
        this.completed = data.completed || null
        this.created = data.created || null
        this.id = data.id
        this.progress = data.progress || 0
        this.status = data.status || "CREATED"
        this.type = data.type
        this.userId = data.userId

        if (data.dataManual || data.data){
            this.data = null
        }

        if (data.info){

            this.info = null
            
            try{
                var i = JSON.parse(data.info || "[]")
                this.info = i
            }catch(e){
                this.info = data.info
            }
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
    Contact, Portfolio, Task, Scenario
}