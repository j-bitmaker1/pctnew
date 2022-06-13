import f from '@/application/functions'
import _ from "underscore"


class Contact {
    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

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
    constructor(data = {}) {

        _.each(data, (v, i) => {
            this[i] = v
        })

    }

    total = function () {

        if (!this.positions) return 0

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
        this.info = null
        this.data = null

        if (data.info){
            try{
                var i = JSON.parse(data.info || "[]")
                this.info = i
            }catch(e){}
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
                }catch(e){}
            }

        
    }

    /*appId: "PCT"
    completed: "20220613072642"
    created: "20220613072621"
    data: "{\"Infos\":[{\"Ticker\":\"MALOX US EQUITY\",\"Name\":\"Blackrock Global Allocation Instl\",\"FullTextInOriginalFile\":\"MALOX US\",\"Value\":100000}]}"
    id: "29248cb1-aed8-4a56-8f10-e4d9c206612c"
    info: "[{\"FileName\":\"testcsv.csv\",\"Size\":15,\"ContentType\":\"text/csv\",\"StorageKey\":\"59803/PCT/PARSEPORTFOLIO/29248cb1-aed8-4a56-8f10-e4d9c206612c\",\"StorageType\":0}]"
    progress: 100
    status: "SUCCESS"
    type: "PARSEPORTFOLIO"
    userId: 59803


    appId: "PCT"
    completed: "20220613072642"
    data: "{\"Infos\":[{\"Ticker\":\"MALOX US EQUITY\",\"Name\":\"Blackrock Global Allocation Instl\",\"FullTextInOriginalFile\":\"MALOX US\",\"Value\":100000}]}"
    error: null
    eventId: 3791466
    id: "29248cb1-aed8-4a56-8f10-e4d9c206612c"
    isSystem: true
    progress: 100
    status: 2
    type: "PARSEPORTFOLIO"
    x_eventType: "ASYNCTASKCOMPLETED"*/
}

export {
    Contact, Portfolio, Task
}