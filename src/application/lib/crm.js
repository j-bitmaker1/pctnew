import Queries from "./queries";

class CRM {
    constructor({api, user, store}){
        this.queries = new Queries()
        this.api = api
        this.store = store

        this.schemas = {
            contact : {}
        }
    }

    query = function(query, p){

        return this.queries.make(query, p)

    }

    leadtocontact = function(id){

        var data = {
            "Type": "CLIENT",
            "Status": "ACTIVE",
            "ID" : id
        }

        return this.api.crm.contacts.update(data)
    }

    leadtocontacts = function(contacts){

        return Promise.all(_.map(contacts, (c) => {
            
            return this.leadtocontact(c)
        }))

    }

    contacttolead = function(id){

        var data = {
            "Type": "LEAD",
            "Status": "ACTIVE",
            "ID" : id
        }

        return this.api.crm.contacts.update(data)
    }

    contacttoleads = function(contacts){

        return Promise.all(_.map(contacts, (c) => {
            
            return this.contacttolead(c)
        }))

    }

    rewriteContactSchema = function(r){

        var convert = function(field, a){
            var c = {...a}

            c.id = field.name
            c.text = 'fields.' + c.id

            c.type = ''
            c.rules = []

            if(field.reference) c.input = 'select'

            if(field.require) c.rules.push({
                rule : 'required'
            })

            if(field.size) c.rules.push({
                max : field.size
            })


            return c
        }

        var schema = {
            general : {
                text : "fields.generalInfo",
                fields : {
                    FName : convert(r.FName),
                    LName : convert(r.LName),
                    Email : convert(r.Email),
                    Status : convert(r.Status, {
                        values : [
                            {
                                text : 'fields.deleted',
                                value : 'deleted',
                            },
                            {
                                text : 'fields.newlead',
                                value : 'newlead',
                            },
                            {
                                text : 'fields.client',
                                value : 'client',
                            }

                        ]
                    })
                }
            },
            additional : {
                text : "fields.additionalInfo",
                fields : {
                    Title : convert(r.Title),
                    Country : convert(r.Country),
                    State : convert(r.State, {placeholder : "NY"}),
                    City : convert(r.City),
                    Zip : convert(r.Zip),
                    Phone : convert(r.Phone)
                }

                

            }
        }

        console.log('schema', schema, r)

        return schema
    }

    prepare = function(){
        return this.api.crm.contacts.scheme().then(r => {
            this.schemas.contact = this.rewriteContactSchema(r)

            this.store.commit('crmschemas', this.schemas)

            return Promise.resolve()
        })
    }
}

export default CRM