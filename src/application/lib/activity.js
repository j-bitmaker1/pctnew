import f from '@/application/functions'
import _ from 'underscore'

class Templates {
    constructor () {

    }

    // type, link, key, search, data

    portfoliopdf(portfolio){
        
        var a = {}

        a.key = portfolio.id
        a.type = 'portfoliopdf'
        
        a.data = {
            
            id : portfolio.id,
            name : portfolio.name
           
        }

        a.action = {
            vueapi : 'portfoliopdf'
        }

        a.search = portfolio.name + ' ' + _.map(portfolio.positions, (p) => {
            return p.ticker.replace(" US", "")
        }).join(' ')

        return a

    }

    compare(portfolios){
        var a = {}

        a.key = _.map(portfolios, (p) => {return p.id}).join(',')
        a.type = 'compare'

        a.data = {
            portfolios : _.map(portfolios, (p) => {
                return {
                    name : p.name,
                    id : p.id,
                    total : p.total()
                }
            }),

            ids : a.key
        }

        a.link = '/compare?ids=' + a.key
        a.search = _.map(portfolios, (p) => {return p.name}).join(', ')

        return a
    }

    portfolio(portfolio){
        
        var a = {}

        a.key = portfolio.id
        a.type = 'portfolio'
        
        a.data = {
            portfolio : {
                name : portfolio.name,
                id : portfolio.id,
                positions : portfolio.positions
            }
        }

        a.link = '/portfolio/' + portfolio.id
        a.search = portfolio.name + ' ' + _.map(portfolio.positions, (p) => {
            return p.ticker.replace(" US", "")
        }).join(' ')

        return a

    }

    client(client){
        
        var a = {}

        a.key = client.ID
        a.type = 'client'
        
        a.data = {
            profile : {
                FName : client.FName,
                LName : client.LName,
                Email : client.Email,
                Zip : client.Zip,
                ID : client.ID,
                type : "CLIENT",
                image : client.image
            }
        }

        a.link = '/client/' + client.ID
        a.search = [client.FName, client.LName, client.Email, client.Zip].join(' ')

        return a

    }

    searching({type, value}){
        var a = {}

        a.key = value
        a.type = 'search'
        a.data = {
            search : {type, value}
        }

        a.action = {
            search : value
        }

        return a

    }

    lead(client){
        
        var a = {}

        a.key = client.ID
        a.type = 'lead'
        
        a.data = {
            profile : {
                FName : client.FName,
                LName : client.LName,
                Email : client.Email,
                Zip : client.Zip,
                ID : client.ID,
                type : "LEAD"
            }
        }

        a.link = '/lead/' + client.ID
        a.search = [client.FName, client.LName, client.Email, client.Zip].join(' ')

        return a

    }

    action({type, subtype, component, action, link, data = {}}){

        if(!type) type = 'setting'

        var a = {
            type, component, action, data,
            link,
            key : type + subtype,
            index :  type + subtype
        }

        return a
    }


}

class Actions {
    constructor () {
        this.keys = [
            'themeToggle', 'changePassword', 'scenarioManager', 'scoreConverter',
            'newPortfolio', 'newClient', 'newLead', 'sharequestionnaire',
            'fileManager'
        ]
    }

    themeToggle() {
        return {
            component : 'themeToggle',
            type : 'setting',
            subtype : 'theme',

            data : {
                label : "labels.theme",
                type : "labels.usersettings"
            }
        }
    }

    changePassword() {
        return {
            type: 'setting',
            subtype: 'changepassword',
            link : "changepassword",
    
         
            data : {
                label : 'common.2901009',
                type : 'labels.usersettings'
            }
        }
    }

    fileManager () {
        return {
            type: 'action',
            subtype: 'fileManager',


            action : {
                vueapi : 'fileManager'
            },

            data : {
                label : 'labels.fileManager',
                type : 'labels.actions'
            }
        }
    }

    scenarioManager () {
        return {
            type: 'setting',
            subtype: 'scenarioManager',


            action : {
                vueapi : 'scenarioManager'
            },

            data : {
                label : 'labels.scenarioManager',
                type : 'labels.crashtestSettings'
            }
        }
    }

    scoreConverter () {
        return {
            type: 'setting',
            subtype: 'scoreConverter',


            action : {
                vueapi : 'scoreConverter'
            },

            data : {
                label : 'labels.scoreConverter',
                type : 'labels.crashtestSettings'
            }
        }
    }

    

    newPortfolio () {
        return {
            type: 'action',
            subtype: 'newPortfolio',


            action : {
                vueapi : 'newPortfolio'
            },

            data : {
                label : 'labels.newPortfolio',
                type : 'labels.actions'
            }
        }
    }

    newClient () {
        return {
            type: 'action',
            subtype: 'newClient',
         
            action : {
                vueapi : 'newClient'
            },

            data : {
                label : 'labels.newClient',
                type : 'labels.actions'
            }
        }
    }

    newLead () {
        return {
            type: 'action',
            subtype: 'newLead',
         
            action : {
                vueapi : 'newLead'
            },

            data : {
                label : 'labels.newLead',
                type : 'labels.actions'
            }
        }
    }

    sharequestionnaire () {
        return {
            type: 'action',
            subtype: 'sharequestionnaire',
         
            action : {
                vueapi : 'sharequestionnaire'
            },

            data : {
                label : 'labels.sharequestionnaireCommon',
                type : 'labels.actions'
            }
        }
    }

    
}

class Activity {
    constructor({api, user, i18n}){
        this.api = api
        this.user = user
        this.history = []
        this.i18n = i18n

        this.templates = new Templates()
        this.actions = new Actions()

        this.key = 'activity'
    }

    clear(){
        this.history = []

        return this.save()
    }

    save() {

        return this.user.id().then(id => {

            localStorage[this.key + id] = JSON.stringify(this.history)

        }).catch(e => {
            console.error(e)
        })
        
    }

    load(){

        this.history = []

        return this.user.id().then(id => {

            this.history = JSON.parse(localStorage[this.key + id] || "[]")

        }).catch(e => {
            console.error(e)
        })
    }

    template(type, object){

        if(!this.templates[type]){
            return Promise.reject('template')
        }

        return this.add(this.templates[type](object))

    }

    add({
        type, link, key, search, data, action, component, index
    }){
        if(!type || !data || !key) return Promise.reject('parameters {type, key, data}')

        this.history = _.filter(this.history, (h) => {
            return !(h.type == type && h.key == key && 
                (type != 'search' || key.indexOf(h.key) > -1) 
            )
        })

        this.history.unshift({type, component, link, key, search, data, date : new Date(), index : index || (type + key), action})

        this.history = _.first(this.history, 300)

        return this.save()
    }

    remove(type, key){
        this.history = _.filter(this.history, (h) => {
            return h.type != type || h.key != key
        })
    }

    search(value, activity){

        return f.clientsearch(value, activity || this.history, (h) => {
            if(h.search){
                return h.search
            }
            else{
                if (h.data && h.data.label && h.data.type){
                    return this.i18n.t(h.data.label) + " " + this.i18n.t(h.data.type)
                }
            }
        })
    }

    getlastByType(type){


        return _.find(this.history, (h) => {
            return h.type == type
        })
    }

    getactions(value){
        var actions = _.map(this.actions.keys, (f) => {
            return this.templates['action'](this.actions[f]()) 
        })

        if(!value){
            return actions
        }

        return this.search(value, actions)
    }
}


export default Activity