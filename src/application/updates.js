var _ = require('underscore');
import f from "./functions";

class Updates {

    data = {
        leads: {
            id: 'leads',
            api: 'crm.contacts.counts',

            prepare : function(data){
                return data.NewLeadsCount
            },

            count: 0
        },

        clients: {
            id: 'clients',
            count: 0
        },

        home: {
            id: 'home',
            api: 'notifications.count',
            count: 0 // notifications count
        },

        portfolios: {
            id: 'portfolios',
            count: 0
        },

        profile: {
            id: 'profile',
            count: 0
        }
    }

    constructor({ api, store }) {

        this.api = api
        this.store = store

    }

    update = function (id, number) {
        if (!this.data[id]) return

        this.data[id].count = number

        this.synkstore()
        this.synkCordova()
    }

    increase = function (id) {
        if (!this.data[id]) return

        this.update(id, (this.data[id].count || 0) + 1)
    }

    decrease = function (id) {
        if (!this.data[id]) return

        if(this.data[id].count)
            this.update(id, (this.data[id].count || 0) - 1)
    }

    clear = function (id) {
        this.update(id, 0)
    }

    clearall = function(){
        _.each(this.data, (d) => {
            this.clear(d.id)
        })
    }

    total = function () {
        return _.reduce(this.data, (m, d) => {
            return m + d.count
        }, 0)
    }

    synkstore = function () {
        var counts = {}

        _.each(this.data, (d) => {
            counts[d.id] = d.count
        })

        this.store.commit('updates', counts)
    }

    synkCordova = function () {

        if (typeof cordova != 'undefined') {
            var cordovabadge = f.deep(cordova, 'plugins.notification.badge')

            if (cordovabadge) cordovabadge.set(this.total())
        }

    }

    synk = function(){
        return Promise.all(_.map(this.data, (d) => {

            if(!d.api){
                return Promise.resolve()
            }

            var request = f.deep(this.api, d.api)

            if(!request){
                return Promise.resolve()
            }

            request().then(r => {

                console.log("UPDATES", r, d.id)

                var result = r.count || 0

                if (d.prepare){
                    result = d.prepare(r)
                }

                this.update(d.id, result)
            }).catch(e => {
                console.log('e', e)
            })

        }))
    }
}

export default Updates