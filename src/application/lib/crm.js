import Queries from "./queries";

class CRM {
    constructor({api, user}){
        this.queries = new Queries()
        this.api = api
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

        console.log("data", data)

        return this.api.crm.contacts.update(data)
    }

    leadtocontacts = function(contacts){

        return Promise.all(_.map(contacts, (c) => {
            
            return this.leadtocontact(c)
        }))

    }
}

export default CRM