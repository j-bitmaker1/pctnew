import { _ } from "core-js";
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

    deletecontact = function(id, p){
        var data = {
            "Status": "DELETED",
            "ID" : id
        }

        return this.api.crm.contacts.update(data, p)
    }

    leadtocontact = function(id, p){

        var data = {
            "Type": "CLIENT",
            "Status": "ACTIVE",
            "ID" : id
        }

        return this.api.crm.contacts.update(data, p)
    }

    leadtocontacts = function(contacts, p){

        return Promise.all(_.map(contacts, (c) => {
            
            return this.leadtocontact(c, p)
        }))

    }

    contacttolead = function(id, p){

        var data = {
            "Type": "LEAD",
            "Status": "ACTIVE",
            "ID" : id
        }

        return this.api.crm.contacts.update(data, p)
    }

    contacttoleads = function(contacts, p){

        return Promise.all(_.map(contacts, (c) => {
            
            return this.contacttolead(c, p)
        }))

    }

    contactAutoUpdate = function(contact = {}, p){

        var update = {}

        if (contact.Type == 'LEAD_NEW') update.Type = "LEAD"
        if ((contact.Products || "").indexOf('PCT') == -1) {
            var products = _.filter((contact.Products || "").split(','), (f) => {return f})

            console.log("products", products)

            products.push('PCT')

            update.products = products.join(",")
        }

        console.log("AUTO UPDATE", update)

        if(!_.isEmpty(update)){

            update.ID = contact.ID

            return this.api.crm.contacts.update(update, p)
        }

        return Promise.resolve()
    }

    getbyids = function(ids, p){
        return this.api.crm.contacts.gets({Ids : ids}, p)
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
                rule : 'max:' + field.size
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
                    /*Status : convert(r.Status, {
                        values : [
                            {
                                text : 'fields.active',
                                value : 'ACTIVE',
                            },
                            {
                                text : 'fields.deleted',
                                value : 'DELETED',
                            }
                        ]
                    })*/
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


        return schema
    }

    prepare = function(){
        return this.api.crm.contacts.scheme().then(r => {
            this.schemas.contact = this.rewriteContactSchema(r)

            this.store.commit('crmschemas', this.schemas)

            return Promise.resolve()
        })
    }

    uploadAvatar = function(ContactId, file, p = {}){

        var data = {
            Name: file.name,
            ContentType: file.type,
            Size: file.size,
            ContactId
        }

        let formData = new FormData();
            formData.append("Data", file);

        return this.api.crm.upload.avatarId(data, p).then((id) => {
            return this.api.crm.upload.avatar(formData, ContactId, id, p)
        })
    }
}

export default CRM