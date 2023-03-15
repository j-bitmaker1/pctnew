import _ from "underscore"

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

            /*if (data.__customfields__.$$PCT_Riskscore)
                this.riskscore = Number(data.__customfields__.$$PCT_Riskscore)*/

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
    fields = []

    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v

            this.fields.push(i)
        })

    }

    total = function () {

        if (!this.positions) return 0

        //if (this.isModel) return 100

        return _.reduce(this.positions, (m, p) => {

            return p.isCovered ? m + p.value : m

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