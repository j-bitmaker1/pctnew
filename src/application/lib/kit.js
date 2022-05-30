import f from '@/application/functions'
import _ from "underscore"


class Contact {
    constructor(data = {}){

        _.each(data, (v, i) => {
            this[i] = v
        })

        if(data.__customfields__){

            this.capacity = Number(data.__customfields__.$$PCT_Capacity)
            this.tolerance = Number(data.__customfields__.$$PCT_Tolerance)
            this.riskscore = Number(data.__customfields__.$$PCT_Riskscore)
            this.questionnaire = Number(data.__customfields__.$$PCT_QuestionnaireId)

        }

    }

    get imageLink(){
        if (this.AvatarId){
            var imageid = this.AvatarId.split('.')[1]

            return 'https://rixtrema.net/api/crm/attachments/download/'+this.CompanyID+'/' + imageid
        }

        return ''
        
    }


}

class Portfolio {
    constructor(data = {}){

        _.each(data, (v, i) => {
            this[i] = v
        })
       
    }

    total = function(){

        if(!this.positions) return 0

        return _.reduce(this.positions, (m, p) => {

            return p.isCovered ? m + p.value : m

        }, 0)

    }

    uncovered = function(){
        return _.reduce(this.positions, (m, p) => {
            return !p.isCovered ? m + p.value : m
        }, 0)
    }
    
}

export {
    Contact, Portfolio
}