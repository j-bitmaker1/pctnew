import Queries from "./queries";
import {Settings} from "@/application/shared/settings";


class CRM {
    constructor(core){
        this.queries = new Queries(core)
        this.api = core.api
        this.store = core.store
        this.core = core

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

        if (contact.Status == 'LEAD_NEW') update.Status = "LEAD"
        if ((contact.Products || "").indexOf('PCT') == -1) {
            var products = _.filter((contact.Products || "").split(','), (f) => {return f})

            products.push('PCT')

            update.products = products.join(",")
        }

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

            if (r)
                this.schemas.contact = this.rewriteContactSchema(r)

            else this.schemas.contact = {}


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


    getCapacitySettings = function(profile){

        if(!profile) {
            return Promise.resolve(null)
        }

        var settingsKey = 'capacity_' + profile.ID

        if(!this.core.dynamicSettings[settingsKey]){
            this.core.dynamicSettings[settingsKey] = new Settings(this.core, 'CAPACITYVALUES', {
                ['CAPACITYVALUES'] : {
                    ['values_' + profile.ID] : {
                        name: 'values_' + profile.ID,
                        default: function() {
                            return null
                        }
                    }
                }
            })
        }

        return this.core.dynamicSettings[settingsKey].getall().then(d => {

            return Promise.resolve(d['values_' + profile.ID] ? d['values_' + profile.ID].value : null)
        })
    }

    getQuestionnaire = function(profile){

        if (profile && profile.questionnaire){

            return this.core.api.crm.questionnaire.getresult(profile.questionnaire).then(r => {
                return Promise.resolve(r)
            })
        }
        else{
            return Promise.resolve(null)
        }


    }

    loadQuestionnaireWithSettings = function(profile){

        var result = {}

        return Promise.all([

            this.getCapacitySettings(profile).then(r => {
                result.fromsettings = r
            }), 
            this.getQuestionnaire(profile).then(r => {
                result.questionnaire = r
            })

        ]).catch(e => {
            console.error(e)

        }).then(() => {
            return Promise.resolve(result)
        })

    }
}

export default CRM