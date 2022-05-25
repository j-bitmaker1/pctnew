import f from '@/application/functions'
import _ from "underscore"

class Contact {
    constructor(data = {}){

        _.each(data, (v, i) => {
            this[i] = v
        })
       
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