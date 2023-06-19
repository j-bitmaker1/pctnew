

import Notifier from "./shared/notifier.js";
import Media from "./shared/media.js";
import Api from "./shared/api.js";
import listeners from './shared/listeners.js'
import f from './shared/functions.js'
import user from './shared/user.js'
import wss from './shared/wss.js'

import CRM from './lib/crm/crm.js'
import PCT from './lib/pct/pct.js'
import CAMPAIGNS from './campaigns/manager.js'

import Vueapi from './vueapi.js'
import Cordovakit from './shared/cordovakit.js'
import Filemanager from './lib/common/filemanager.js'
//import FX from './shared/utils/fx.js'

import { Settings, LSSettings } from "./shared/settings.js";



import Updates from "./updates.js";
import Filesystem from "./lib/common/filesystem.js"
import Activity from "./lib/common/activity.js"

import Images from "./shared/utils/images.js";

import Integrations from "./shared/integrations.js";

var settings = {
    server: {
        PDF: {
            logotype: {
                name: 'logotype',
                default: function () {
                    return ''
                },
            },

            disclosure: {
                name: 'disclosure',
                default: function () {
                    return {}
                },
            }
        },
        STRESS: {
            scenarios: {

                name: 'scenarios',
                default: function () {
                    return []
                },

            },

            definedRiskScore: {

                name: 'scenarios',
                default: function () {

                    return {
                        use: 'no',
                        scores: {}
                    }

                },

            },
        },

        CAMPAIGNS: {
            signature: {
                name: 'signature',
                default: function () {
                    return null
                },
            }
        },

        USER : {
            adviserinfo : {
                name: 'adviserinfo',
                default: function () {
                    return ''
                },
            },
        }
    },

    local: {
        PDF: {
            reports: {
                name: 'reports',
                default: function () {
                    return {}
                },
            }
        },

        UI: {

        }
    }
}


class Core {

    clbks = {}

    appid = 'net.rixtrema.pct'

    constructor(vm, p) {
        if (!p) p = {}

        this.vxstorage = p.vxstorage
        this.i18n = p.i18n

        this.apiHandlers = {
            error: function () { },
            success: function () { }
        }

        this.domain = p.domain
        this.ignoring = {}
        this.vm = vm
        this.wss = new wss(this, 'rixtrema.net:21021')

        this.notifier = new Notifier(this)
        this.api = new Api(this)

        this.onlineListener = new listeners.online(this)
        this.focusListener = new listeners.focus(this)

        this.online = true
        this.focus = true
        this.store = vm.$store
        this.loading = true

        this.external = {}
        this.hiddenInParent = false
        this.media = new Media()


        this.settings = {
            stress: new Settings(this, "STRESS", settings.server),
            campaigns: new Settings(this, "CAMPAIGNS", settings.server),
            user: new Settings(this, "USER", settings.server),
            pdf: new Settings(this, "PDF", settings.server),
            lspdf: new LSSettings(this, "PDF", settings.local),
            ui: new LSSettings(this, "UI", settings.local)
        }

        this.dynamicSettings = {}

        this.filemanager = new Filemanager(this)
        this.crm = new CRM(this)
        this.pct = new PCT(this)

        //this.fx = new FX(this)
        this.filesystem = new Filesystem(this)

        this.cordovakit = new Cordovakit(this)
        this.vueapi = new Vueapi(this)
        this.updates = new Updates(this)

        this.campaigns = new CAMPAIGNS(this, this.settings.campaigns)



        this.user = new user(this, {

            prepare: () => {

                return Promise.all([this.api.checkUpdates(), this.activity.load(), this.pct.prepare(), this.crm.prepare()]).catch(e => {
                    return Promise.reject(e)
                })

            },

            clearing: () => {

                _.each(this.settings, (settings) => {
                    settings.clear()
                })

                this.api.clearCache()

                this.vxstorage.clear()

                this.updates.clearall()

                this.store.commit('clearall')

            }

        })

        this.activity = new Activity(this)

        //this.pdfreports = new PDFReports(this)

        this.integrations = new Integrations(this)

        this.api.prepare().then(() => {
            this.user.init()
        })

    }

    initpdfreports = function (PDFReports) {

        if (this.pdfreports) return
        this.pdfreports = new PDFReports(this)

    }

    on = function (event, key, f) {
        if (!this.clbks[event]) this.clbks[event] = {}

        this.clbks[event][key] = f
    }

    off = function (event, key) {
        if (!this.clbks[event]) this.clbks[event] = {}

        delete this.clbks[event][key]
    }

    emit = function (event, data) {
        if (!this.clbks[event]) this.clbks[event] = {}

        _.each(this.clbks[event], (c) => {
            c(data)
        })
    }

    logerror = function (type, data) {

        if (window.Logger) {

            window.Logger.error({
                err: type,
                payload: data,
                code: 402,
            });

        }
    }

    mobileview = function () {
        return window.innerWidth <= 768
    }

    destroy = function () {
        this.store.commit('clearall')

        this.user.unlinkwss(this.wss)

        this.pct.destroy()

        this.removeEvents()

        this.vm.$destroy();

    }

    init = function () {

        this.focusListener.init()
        this.onlineListener.init()

        this.initEvents()

    }


    setUnauthorized = function (v) {
        this.unauthorized = v
        this.store.commit('SET_UNAUTHORIZED', v)
    }

    initWithUserBase = function () {

        return Promise.resolve()

    }

    initWithUser = function (credentials) {

        return this.initWithUserBase()

    }

    waitonline = function () {

        if (this.online) return Promise.resolve()

        return new Promise((resolve, reject) => {

            f.retry(() => {
                return this.online;
            }, function () {

                resolve()

            }, 20)

        })


    }


    removeEvents = function () {
        delete this.focusListener.clbks.resume.core
        delete this.focusListener.clbks.pause.core
        delete this.onlineListener.clbks.online.core
        delete this.onlineListener.clbks.offline.core

        document.removeEventListener("drop", this.dropFiles)
    }

    initEvents = function () {
        this.focusListener.clbks.resume.core = (time) => {

            this.focus = this.focusListener.focus

            if (time > 60) {
            }
        }

        this.focusListener.clbks.pause.core = () => {
            this.focus = this.focusListener.focus
        }

        this.onlineListener.clbks.online.core = (time) => {
            this.online = this.onlineListener.online
        }

        this.onlineListener.clbks.offline.core = () => {
            this.online = this.onlineListener.online
        }

        if(typeof document != 'undefined'){
            document.addEventListener("drop", this.dropFiles.bind(this))
            document.addEventListener("dragover", event => {
                event.preventDefault()
            })
        }

        
    }

    dropFiles = function (event) {
        event.preventDefault()

        var files = []


        _.each(event.dataTransfer.files, (F) => {
            files.push(F)
        })

        this.store.commit('uploading', files)

        this.vueapi.fileManager()
    }

    currentTime = function () {
        var created = Math.floor((new Date().getTime()) / 1000)

        if (this.timeDifference) {
            created += this.timeDifference
        }

        return created;
    }

    wait = function () {
        return f.pretry(() => {
            return !this.loading
        }).then(() => {

            return Promise.resolve()

        })
    }

    gotoRoute(route) {

        this.cancelDefaultRoute = true;

        this.vm.$router.push(route).catch(e => { })
    }

    updateUser() {

    }

    sitemessage(title) {

        var position = "bottom-right";

        if (this.vm.$store && this.vm.$store.state.mobile) {
            position = 'top-left'
        }

        this.vm.$message({
            message: title,
            zIndex: 9999,
            supportHTML: true,
            wrapperClassName: "notificationWrapper",
            position: position,
            icon : 'fas fa-info-circle',
            type: 'info',
            duration: 2000
        })
    }

    menu(v) {

        this.store.commit('SET_MENU', v ? {
            items: v.items,
            item: v.item,
            handler: v.handler
        } : null)

    }

    action(path, data) {
        var action = f.deep(this, path)

        if (!action) {
            return Promise.reject({
                error: 'Action: ' + path
            })
        }
        else {
            return action(data)
        }
    }

    invalidateDb(dbIndex, updated, data) {
        return this.api.invalidateDb(dbIndex, updated, data).then((itemsId) => {

            _.each(itemsId, (id) => {
                this.emit('invalidate', {
                    [data.type]: id,
                    key: dbIndex
                })
            })
        })
    }

    ignore(type, key) {

        if (!this.ignoring[type])
            this.ignoring[type] = []

        this.ignoring[type].push(key)
    }

    updateByWs(data, types, invalidate = []) {

        _.each(types, (type) => {

            if (!this.ignoring[type]) this.ignoring[type] = []

            var index = _.findIndex(this.ignoring[type], (v) => {

                return _.find(v, (value, key) => {
                    return data[key] == value
                })

            })

            if (index > -1) {


                this.ignoring[type].splice(index, 1)

                return
            }

            try {


                var { updated, from = {} } = this.vxstorage.update(data, type)

            } catch (e) {
                console.error(e)
            }
        })

        this.api.invalidateStorageNow(invalidate)

    }

    updateIntegrationsByWs() {
        this.emit('updateintegrations', {});
    }

    createByWs(data, type, invalidate = []) {

        if (!this.ignoring[type])
            this.ignoring[type] = []

        var index = _.findIndex(this.ignoring[type], (v) => {
            return _.find(v, (value, key) => {
                return data[key] == value
            })
        })

        if (index > -1) {

            this.ignoring[type].splice(index, 1)

            return
        }

        this.api.invalidateStorageNow(invalidate)


        this.emit('created', {
            data,
            type
        })

        if (type == 'lead' && data.Status == "LEAD_NEW") {
            this.updates.increase('leads')
        }

        if (type == 'lead' && (data.Status == "LEAD_NEW" || data.Type == "LEAD")) {
            this.updates.increase('totalLeads')
        }

        if (type == 'client' && (data.Type == "CLIENT")) {
            this.updates.increase('totalClients')
        }

    }

    readNotification(ids) {

        _.each(ids, () => {
            this.updates.decrease('home')
        })

        this.emit('readNotification', ids)

    }

    readAllNotifications() {
        this.updates.clear('home')

        this.emit('readAllNotifications', ids)
    }

    notification(notification) {

        this.updates.increase('home')

        if (this.vm.$route.name != 'index')
            this.store.commit('addNotification', notification)

        this.emit('notification', notification)
    }

    filehandler(blob, p = {}) {

        if (!p.forcedownload) {
            if (blob.type == 'application/pdf') return this.vueapi.pdfviewer({
                blob,
                name: p.name
            })

            if (blob.type.indexOf('image') > -1) {

                return f.Base64.blobToBase64(blob).then(b64 => {

                    var images = new Images()

                    return images.wh(b64).then(i => {

                        return this.vueapi.gallery([{
                            src: b64,
                            ...i
                        }])

                    })

                })

            }
        }


        return f.download(blob, p.name)

    }



    getsettings(type, id) {

        var sk = type + '_' + id

        if (!this.dynamicSettings[sk]) {
            this.dynamicSettings[sk] = new Settings(this, type, {
                [type]: {
                    ['values_' + id]: {
                        name: 'values_' + id,
                        default: function () {
                            return null
                        }
                    }
                }
            })
        }

        return this.dynamicSettings[sk].getall().then(d => {

            if (d['values_' + id]) return d['values_' + id].value

        })
    }

    setsettings(type, id, value) {

        var sk = type + '_' + id

        if (!this.dynamicSettings[sk]) {
            this.dynamicSettings[sk] = new Settings(this, type, {
                [type]: {
                    ['values_' + id]: {
                        name: 'values_' + id,
                        default: function () {
                            return null
                        }
                    }
                }
            })
        }

        return this.dynamicSettings[sk].set('values_' + id, value)
    }

    getaidata(context){
        var promises = []
        var ct = null
        var dct = null
        var capacity = null

        var extra = { }
        var benchmarks = null
        var scenarios = []
        var usedscenarios = []

        if (context.portfolio || context.readyportfolio){

            promises.push( 

                (!context.readyportfolio ? this.api.pctapi.portfolios.get(context.portfolio) : Promise.resolve(context.readyportfolio)).then(r => {

                    var total = r.total()

                    return this.pct.stresstestskt([r], 'd', { term: true, fee : asset => {
                        return r.advisorFee || 0
                    }}).then(cts => {

                        ct = cts.cts[r.id]

                        return this.pct.stressdetails(r, {
                            term : ct.term || null
                        }).then(R => {

                            dct = R
                            ct.contributors = dct.contributors
                            dct.ocr = ct.ocr

                            return this.pct.scenariosWithCustoms().then(s => {
                                scenarios = s
                            })

                        })
        
                    }).then(() => {
                        return this.pct.assets(r).then(assetsInfo => {
                            var positions = []

                            _.each(r.positions, (p) => {

                                var ai = assetsInfo[p.ticker] || {}

                                positions.push({
                                    ticker : p.ticker,
                                    value : p.value,
                                    pvalue : (100 * p.value / total).toFixed(1),
                                    name : ai.name || "",
                                    expRatio : ai.expRatio || 0
                                })
                            })

                            extra.positions = _.sortBy(positions, (p) => {
                                return - p.value
                            })
                        })
                    }).then(() => {

                        return this.pct.benchmarks(r.total() / 100).then(r => {
                            benchmarks = r
                        })

                    }).then(() => {

                        var getbenchmarkscenario = function(index, id){

                            var value = (_.find(benchmarks[index].scenarios, (scenario) => {
                                return scenario.id == id
                            }) || {}).loss || 0

                            return {
                                value,
                                pvalue : (100 * value / total).toFixed(1)
                            }
                        }


                        var worstScenarios = _.map(_.first(_.sortBy(dct.scenarios, (scenario) => {
                            return scenario.loss
                        }), 3), (scenario) => {

                            usedscenarios.push(scenario.id)

                            var info = _.find(scenarios, s => {
                                return s.id == scenario.id
                            }) || {}

                            var contributors = _.first(_.sortBy(scenario.contributors, (contributor) => {
                                return contributor.loss
                            }), 3)

                            contributors = _.map(contributors, (contributor) => {

                                var position = r.get(contributor.ticker)

                                return {
                                    ...contributor,
                                    pvalue : (100 * contributor.value / total).toFixed(1),
                                    rvalue : (100 * contributor.value / position.value).toFixed(1)
                                }
                            })

                            return {
                                ...scenario,
                                contributors,

                                benchmarks : {
                                    spy : getbenchmarkscenario('spy', scenario.id),
                                    spyagg : getbenchmarkscenario('spyagg', scenario.id)
                                },

                                ploss : (100 * scenario.loss / total).toFixed(1),
                                description : info.description || "",
                                shocks : info.shocks || ""
                            }

                        })

                        var positiveScenarios = _.map(_.first(
                            _.filter(
                                _.sortBy(dct.scenarios, (scenario) => {
                                    return -scenario.loss
                                }), 
                                (scenario) => {
                                    return (scenario.id != -2) && scenario.loss > 0
                                }
                            ),

                        2), (scenario) => {

                            usedscenarios.push(scenario.id)

                            var info = _.find(scenarios, s => {
                                return s.id == scenario.id
                            }) || {}

                            var contributors = _.first(_.sortBy(scenario.contributors, (contributor) => {
                                return contributor.loss
                            }), 3)

                            contributors = _.map(contributors, (contributor) => {
                                return {
                                    ...contributor,
                                    pvalue : (100 * contributor.value / total).toFixed(1)
                                }
                            })

                            return {
                                ...scenario,
                                contributors,

                                benchmarks : {
                                    spy : getbenchmarkscenario('spy', scenario.id),
                                    spyagg : getbenchmarkscenario('spyagg', scenario.id)
                                },

                                ploss : (100 * scenario.loss / total).toFixed(1),
                                description : info.description || "",
                                shocks : info.shocks || ""
                            }
                            
                        })

                        extra.crashtest = {
                            ocr : dct.ocr,
                            term : dct.term,
                            profit : dct.profit,
                            pprofit : (100 * dct.profit / total).toFixed(1),
                            
                            worstScenarios,
                            positiveScenarios,
                            total : r.total(),
                            loss : dct.loss,
                            ploss: (100 * dct.loss / total).toFixed(1),

                            yield : total * ct.yield,
                            pyield : (100 * ct.yield).toFixed(1),

                            ltr : total * ct.ltr,
                            pltr : (100 * ct.ltr).toFixed(1),
                        }

                        console.log('ct.ltr', ct.ltr)

                        extra.benchmarks = {
                            spy : _.clone(benchmarks.spy || {}),
                            spyagg : _.clone(benchmarks.spyagg || {})
                        }

                        delete extra.benchmarks.spy.scenarios
                        delete extra.benchmarks.spyagg.scenarios

                    })

                }).catch(e => {
                    console.error(e)
                })
                
            )
        }

        if (context.client){

            promises.push(
                this.api.crm.contacts.gets({Ids : [context.client]}).then(c => {
                    var profile = c[0]

                    extra.clientName = profile.FName

                    return this.crm.loadQuestionnaireWithSettings(profile)

                }).then(({questionnaire, fromsettings}) => {

                    var initial = fromsettings ? fromsettings : (questionnaire ? this.pct.riskscore.convertQrToCapacity(questionnaire.capacity) : {})

                    var values = {
                        ... {
                            'ages': [20, 40],
                            'savings': 10000,
                            'save': 0,
                            'salary': 200000,

                            //// extra

                            'savemoreRange': [20, 40],
                            'withdrawRange': [20, 40],
                            'withdraw': 0
                        },
                        ... initial
                    }

                    var options = {
                        age : values.ages[0],
                        retire : values.ages[1],
                        savings : values.savings,
                        save : values.save,
                        withdraw : values.withdraw,
                        salary : values.salary //terminal value
                    }
            
                    var extradata = {
                        savemoreRange1 : values.savemoreRange[0],
                        savemoreRange2 : values.savemoreRange[1],
                        withdrawRange1 : values.withdrawRange[0],
                        withdrawRange2 : values.withdrawRange[1],
                        withdraw : values.withdraw
                    }
                    
                    var capacityR = new this.pct.capacity({
                        options : options,
                        extra : extradata
                    })

                    var simulation = capacityR.simulation()

                    capacity = {
                        values : {...options, ...extradata},

                        simulation : {
                            max : simulation.max,
                            top : simulation.topp,
                            under : simulation.underp,
                        },

                        result : simulation.capacity || 0,
                        hasquestionnaire : questionnaire || fromsettings ? true : false
                    }

                    extra.capacity = capacity

                }).catch(e => {
                    console.error(e)
                })
            )
            
        }

        if (context.readyclient){
            extra.clientName = context.readyclient.FName
        }

        if (context.readycapacity){
            extra.capacity = {
                values : {...context.readycapacity.options, ...context.readycapacity.extradata},
                simulation : {
                    max : context.readycapacity.simulation.max,
                    top : context.readycapacity.simulation.topp,
                    under : context.readycapacity.simulation.underp,
                },
                result : context.readycapacity.simulation.capacity || 0,
                hasquestionnaire : true
            }
        }


        return Promise.all(promises).then(() => {
            return Promise.resolve(extra)
        })
    }

    gettasks(file){
        var t = _.filter(this.store.state._task, (t) => {
            return t.fileId == file.id
        })

        var obj = {}

        _.each(t, (t) => {
            obj[t.type] = t
        })

        return obj
    }

}

export default Core
