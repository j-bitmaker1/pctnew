import _ from "underscore"

const and = "AND"
const or = "OR"

const conditions = {
    startswith : 'startswith',
    like : 'like',
    notinlist : 'notinlist',
    inlist : 'inlist',
    eq : 'eq'
}

const join = {and, or}

class Templates {
    constructor(){

    }

    status_active = function(){
        return this.condition(conditions.notinlist, "Status", ["DELETED", "INACTIVE"])
    } 

    type_eq = function(type){

        return this.condition(conditions.eq, "Type", type)

    }

    ids_inlist = function(ids){

        return this.condition(conditions.inlist, "ID", ids)

    }

    condition = function(condition, name, values){

        if(!_.isArray(values)) values = [values]

        return {
            condition,
            name,
            value : values
        }
    }

    search = function(value){

        var operands = []

        if(value){
            operands.push( this.condition(conditions.startswith, 'FName', value) )
            operands.push( this.condition(conditions.startswith, 'LName', value) )
            operands.push( this.condition(conditions.startswith, 'Email', value) )
            operands.push( this.condition(conditions.like, 'Phone', value) )
        }
        
        return operands

        //return this.group(operands, join.or)

    }

    group = function(operands, join){
        return {
            join,
            operands
        }
    }
}

class Queries {
    constructor(){
        this.t = new Templates()
    }

    make = function(query, p){
        if(this[query]) return this[query](p)

        return {}
    }

    simplesearch = function({search, type}){
        var groups = []

        groups.push(
            this.t.group([
                this.t.status_active(),
                this.t.type_eq(type)
            ], join.and)
        )

        if(search){

            groups.push(
                this.t.group(this.t.search(search), join.or)
            )
        }

        return {
            groups,
            join : join.and
        }
    }

    byids = function({ids}){
        var groups = []

        groups.push(
            this.t.group([
                this.t.ids_inlist(ids)
            ])
        )

        return {
            groups
        }
    }
}

export default Queries