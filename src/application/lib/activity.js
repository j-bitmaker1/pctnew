import f from '@/application/functions'
import _ from 'underscore'

class Templates {
    constructor () {

    }

    // type, link, key, search, data

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

        a.link = 'portfolio/' + portfolio.id
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
                ID : client.ID
            }
        }

        a.link = 'client/' + client.ID
        a.search = [client.FName, client.LName, client.Email, client.Zip].join(' ')

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
                ID : client.ID
            }
        }

        a.link = 'lead/' + client.ID
        a.search = [client.FName, client.LName, client.Email, client.Zip].join(' ')

        return a

    }
}

class Activity {
    constructor({api, user}){
        this.api = api
        this.user = user
        this.history = []

        this.templates = new Templates()

        this.key = 'activity'
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
        type, link, key, search, data
    }){
        if(!type || !link || !data || !key) return Promise.reject('parameters {type, link, key, data}')

        this.history = _.filter(this.history, (h) => {
            return h.type != type || h.key != key
        })

        this.history.unshift({type, link, key, search, data, date : new Date(), index : type + key})

        this.history = _.first(this.history, 300)

        return this.save()
    }

    search(value){

        return f.clientsearch(value, this.history, (h) => {
            if(h.search){
                return h.search
            }
        })

    }
}


export default Activity