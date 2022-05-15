import Queries from "./queries";

class CRM {
    constructor({api, user}){
        this.queries = new Queries()
        this.api = api

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

    prepare = function(){
        return this.api.crm.contacts.scheme().then(r => {
            this.schemas.contact = r

            console.log('this.schemas.contact', this.schemas.contact)
            return Promise.resolve()
        })
    }
}

export default CRM