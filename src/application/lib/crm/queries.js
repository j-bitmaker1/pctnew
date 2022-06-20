import _ from "underscore"
import f from "@/application/shared/functions.js"

const and = "AND"
const or = "OR"

const conditions = {
    startswith : 'startswith',
    like : 'like',
    notinlist : 'notinlist',
    inlist : 'inlist',
    eq : 'eq',
    contain : 'contain'
}

const join = {and, or}

class Templates {
    constructor(){

    }

    status_product = function(){
        return this.condition(conditions.like, "products", "pct")
    } 

    status_active = function(){
        return this.condition(conditions.notinlist, "Status", ["DELETED", "INACTIVE"])
    } 

    userid = function(userid){
        return this.condition(conditions.inlist, "UserId", [userid])
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

       
        var groupOperands = []
       

        if(value){

            var words = f.bw(value.toLowerCase())

            _.each(words, (w) => {

                var operands = []

                var numbers = w.replace(/[^0-9]/g, '')
                var letters = w.replace(/[^a-z]/g, '')

                if (letters.length){
                    operands.push( this.condition(conditions.like, 'FName', letters) )
                    operands.push( this.condition(conditions.like, 'LName', letters) )
                    operands.push( this.condition(conditions.like, 'Email', letters) )
                    operands.push( this.condition(conditions.like, 'Title', letters) )

                    operands.push( this.condition(conditions.like, 'City', letters) )
                    operands.push( this.condition(conditions.like, 'State', letters) )
                    operands.push( this.condition(conditions.like, 'Country', letters) )
                }   

                if(numbers.length){
                    if (numbers.length > 4)
                        operands.push( this.condition(conditions.like, 'Phone', numbers) )

                    if (numbers.length > 2)
                        operands.push( this.condition(conditions.like, 'Zip', numbers) )
                }

                groupOperands.push(operands)
                
            })
            
        }
        
        return groupOperands

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
    constructor(core){
        this.t = new Templates()
        this.core = core
    }

    make = function(query, p){
        if(this[query]) return this[query](p)

        return {}
    }

    simplesearch = function({search, type}){
        var groups = []

        

        groups.push(
            this.t.group([
                this.t.status_product(),
                this.t.status_active(),
                this.t.userid(this.core.user.info.ID),
                this.t.type_eq(type)
            ], join.and)
        )

        if(search){

            var soperands = this.t.search(search)
            
            _.each(soperands, (ops) => {
                groups.push(
                    this.t.group(ops, join.or)
                )
            })
            
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