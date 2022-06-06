import f from '@/application/functions'
import _ from 'underscore'

var meta = {
    PDF: {
        logotype: {
            name: 'logotype',
            default: function() {
                return ''
            },
        },

        disclosure: {
            name: 'disclosure',
            default: function() {
                return {}
            },
        }
    },
    STRESS: {
        scenarios: {

            name: 'scenarios',
            default: function() {
                return []
            },

        },

        useKeyScenarios: {
            name: 'useKeyScenarios',
            default: function() {
                return true
            },

        }
    }
}

var lsmeta = {
    PDF: {
        reports: {
            name: 'reports',
            default: function() {
                return {}
            },
        }
    }
}

class Settings {

    product = 'PCT'

    constructor({ api }, type) {
        this.api = api
        this.data = null
        this.type = type

        this.meta = {}

        _.each(meta[this.type], (s, k) => {
            this.meta[k] = _.clone(s)
        })

    }

    set(name, value) {
        var s = this.get(name)

        if (!s) return Promise.reject('none')

        s.value = value

        if (s.id) {
            return this.api.user.settings.update(s.id, name, value, this.type)
        } else {
            return this.api.user.settings.create(name, value, this.type).then(r => {

                this.data = {
                    ...this.data,
                    ...this.parse([r])
                }

                return Promise.resolve(this.data)
            })
        }
    }

    parse(r) {
        var d = {}

        _.each(r, (r) => {

            if (!this.meta[r.Name]) return
            if (r.Product != this.product) return

            try {

                var setting = {
                    id: r.Id,
                    name: r.Name,
                    value: JSON.parse(r.Info),
                    default: this.meta[r.Name].default(),
                }

                d[setting.name] = setting

            } catch (e) {}


        })

        return d
    }

    getbymeta() {
        var d = {}

        _.each(this.meta, (s, name) => {
            d[name] = this.get(name)
        })

        return d
    }

    get(name) {

        if (!this.data || !this.meta[name]) return null

        if (!this.data[name]) return {
            name: name,
            value: this.meta[name].default(),
            default: this.meta[name].default(),
            id: null
        }

        return this.data[name]
    }

    getall() {

        if (this.data) return Promise.resolve(this.getbymeta())

        return this.api.user.settings.getall(this.type).then(r => {
            this.data = this.parse(r)

            return Promise.resolve(this.getbymeta())
        }).catch(e => {
            return Promise.resolve(this.getbymeta())
        })

    }

}

class LSSettings {

    product = 'PCT'

    constructor({ api }, type) {
        this.data = null
        this.type = type

        this.meta = {}

        _.each(lsmeta[this.type], (s, k) => {
            this.meta[k] = _.clone(s)
        })

    }

    set(name, value) {

        var s = this.get(name)

        

        if (!s) {
            throw new Error('none')
        }

        if(!this.data[name]) this.data[name] = s

        s.value = value

        var dt = _.map(this.getbymeta(), (d) => {
            return {
                name: d.name,
                value: d.value
            }
        })


        localStorage.setItem('LSSettings_' + this.type, JSON.stringify(dt))
    }

    parse(r) {

        var d = {}

        try {
            r = JSON.parse(r)
        } catch (e) {
            console.error(e)
            return d
        }

        _.each(r, (r) => {

            if (!this.meta[r.name]) return

            try {

                var setting = {
                    name: r.name,
                    value: r.value,
                    default: this.meta[r.name].default(),
                }

                d[setting.name] = setting

            } catch (e) {
                console.error(e)
            }


        })

        return d
    }

    getbymeta() {
        var d = {}

        _.each(this.meta, (s, name) => {
            d[name] = this.get(name)
        })

        return d
    }

    get(name) {

        if (!this.data || !this.meta[name]) return null

        if (!this.data[name]) return {
            name: name,
            value: this.meta[name].default(),
            default: this.meta[name].default()
        }

        return this.data[name]
    }

    getall() {

        if (!this.data) this.data = this.parse(localStorage.getItem('LSSettings_' + this.type) || "{}")

        return this.getbymeta()

    }

}

export {
    Settings,
    LSSettings
}