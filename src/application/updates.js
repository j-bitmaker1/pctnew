var _ = require('underscore');
import f from "./functions";

class Updates {

    data = {
        leads: {
            id: 'leads',
            api: '',
            count: 0
        },

        clients: {
            id: 'clients',
            count: 0
        },

        home: {
            id: 'home',
            api: '',
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

        this.update(id, this.data[id].count + 1)
    }

    clear = function (id) {
        this.update(id, 0)
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

            if (cordovabadge) cordovabadge.set(total())
        }

    }
}

export default Updates