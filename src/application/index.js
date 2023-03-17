

import Notifier from "./shared/notifier";
import Api from "./shared/api";
import listeners from './shared/listeners'
import f from './shared/functions'
import user from './shared/user'
import wss from './shared/wss'

import CRM from './lib/crm/crm'
import PCT from './lib/pct/pct'
import CAMPAIGNS from './campaigns/manager'

import Vueapi from './vueapi'
import Cordovakit from './shared/cordovakit'
import Filemanager from './lib/common/filemanager'
//import FX from './shared/utils/fx.js'

import {Settings, LSSettings} from "./shared/settings";



import Updates from "./updates";
import Filesystem from "./lib/common/filesystem"
import Activity from "./lib/common/activity"

import Images from "./shared/utils/images";

var settings = {
    server : {
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
    
            definedRiskScore : {
    
                name: 'scenarios',
                default: function() {
    
                    return {
                        use : 'no',
                        scores : {}
                    }
                    
                },
    
            },
        },

        CAMPAIGNS : {
            signature : {
                name: 'signature',
                default: function() {
                    return null
                },
            }
        }
    },

    local : {
        PDF: {
            reports: {
                name: 'reports',
                default: function() {
                    return {}
                },
            }
        },

        UI : {

        }
    }
}


class Core {

    clbks = {}

    appid = 'net.rixtrema.pct'

    constructor(vm, p){
        if(!p) p = {}

        this.vxstorage = p.vxstorage
        this.i18n = p.i18n

        this.apiHandlers = {
            error : function(){},
            success : function(){}
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
        

        this.settings = {
            stress : new Settings(this, "STRESS", settings.server), 
            campaigns : new Settings(this, "CAMPAIGNS", settings.server), 
            user : new Settings(this, "USER", settings.server),
            pdf : new Settings(this, "PDF", settings.server),
            lspdf : new LSSettings(this, "PDF", settings.local),
            ui : new LSSettings(this, "UI", settings.local)
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

            prepare : () => {

                return Promise.all([this.api.checkUpdates(), this.activity.load(), this.pct.prepare(), this.crm.prepare()]).catch(e => {
                    return Promise.reject(e)
                })

            },

            clearing : () => {

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

        this.api.prepare().then(() => {
            this.user.init()
        })
       
    }

    initpdfreports = function(PDFReports){

        if (this.pdfreports) return
            this.pdfreports = new PDFReports(this)

    }

    on = function(event, key, f){
        if(!this.clbks[event]) this.clbks[event] = {}

        this.clbks[event][key] = f
    }

    off = function(event, key){
        if(!this.clbks[event]) this.clbks[event] = {}

        delete this.clbks[event][key]
    }

    emit = function(event, data){
        if(!this.clbks[event]) this.clbks[event] = {}

        _.each(this.clbks[event], (c) => {
            c(data)
        })
    }

    logerror = function(type, data){

        if (window.Logger){

            window.Logger.error({
                err: type,
                payload: data,
                code: 402,
            });

        }
    }

    mobileview = function(){
        return window.innerWidth <= 768
    }

    destroy = function(){
        this.store.commit('clearall')

        this.user.unlinkwss(this.wss)

        this.pct.destroy()

        this.removeEvents()

        this.vm.$destroy();

    }

    init = function(){
        
        this.focusListener.init()
        this.onlineListener.init()

        this.initEvents()

    }
    

    setUnauthorized = function(v){
        this.unauthorized = v
        this.store.commit('SET_UNAUTHORIZED', v)
    }

    initWithUserBase = function(){

        return Promise.resolve()

    }

    initWithUser = function(credentials){

        return this.initWithUserBase()

    }

    waitonline = function(){

        if(this.online) return Promise.resolve()

        return new Promise((resolve, reject) => {

            f.retry(() => {
                return this.online;
            }, function () {

                resolve()

            }, 20)

        })


    }


    removeEvents = function(){
        delete this.focusListener.clbks.resume.core
        delete this.focusListener.clbks.pause.core
        delete this.onlineListener.clbks.online.core
        delete this.onlineListener.clbks.offline.core

        document.removeEventListener("drop", this.dropFiles)
    }

    initEvents = function(){
        this.focusListener.clbks.resume.core = (time) => {

            this.focus = this.focusListener.focus

            if(time > 60){
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

        document.addEventListener("drop", this.dropFiles.bind(this))
        document.addEventListener("dragover", event => {
            event.preventDefault()
        })
    }

    dropFiles = function(event){
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

    wait = function(){
        return f.pretry(() => {
			return !this.loading
		}).then(() => {

			return Promise.resolve()

		})
    }

    gotoRoute(route){

        this.cancelDefaultRoute = true;

        this.vm.$router.push(route).catch(e => {})
    }

    updateUser(){
        
    }

    sitemessage(title){

        var position = "bottom-right";

        if (this.vm.$store.state.mobile){
            position = 'top-left'
        }
            
        this.vm.$message({
            title: title,
            zIndex: 999,
            supportHTML: true,
            wrapperClassName: "notificationWrapper",
            position: position,
            type: 'info',
            duration : 2000
          })
    }

    menu(v){

        this.store.commit('SET_MENU', v ? {
			items : v.items,
			item : v.item,
            handler : v.handler
		} : null)

    }

    action(path, data){
        var action = f.deep(this, path)

        if(!action){
            return Promise.reject({
                error : 'Action: ' + path
            })
        }
        else{
            return action(data)
        }
    }

    invalidateDb(dbIndex, updated, data){
        return this.api.invalidateDb(dbIndex, updated, data).then((itemsId) => {

            _.each(itemsId, (id) => {
                this.emit('invalidate', {
                    [data.type] : id,
                    key : dbIndex
                })
            })
        })
    }

    ignore(type, key){

        if(!this.ignoring[type]) 
            this.ignoring[type] = []

        this.ignoring[type].push(key)
    }

    updateByWs(data, types, invalidate = []){

        _.each(types, (type) => {

            if(!this.ignoring[type]) this.ignoring[type] = []

            var index = _.findIndex(this.ignoring[type], (v) => {

                return _.find(v, (value, key) => {
                    return data[key] == value
                })

            })

            if (index > -1){


                this.ignoring[type].splice(index, 1)

                return
            }

            try{


                var { updated, from = {} } = this.vxstorage.update(data, type)

            }catch(e){
                console.error(e)
            }
        })

        this.api.invalidateStorageNow(invalidate)
        
    }

    createByWs(data, type, invalidate = []){

        if(!this.ignoring[type]) 
            this.ignoring[type] = []

        var index = _.findIndex(this.ignoring[type], (v) => {
            return _.find(v, (value, key) => {
                return data[key] == value
            })
        })

        if (index > -1){

            this.ignoring[type].splice(index, 1)

            return
        }

        this.api.invalidateStorageNow(invalidate)


        this.emit('created', {
            data, 
            type
        })

        if (type == 'lead' && data.Status == "LEAD_NEW"){
            this.updates.increase('leads')
        }

        if (type == 'lead' && (data.Status == "LEAD_NEW" || data.Type == "LEAD")){
            this.updates.increase('totalLeads')
        }

        if (type == 'client' && (data.Type == "CLIENT")){
            this.updates.increase('totalClients')
        }
        
    }

    readNotification(ids){

        _.each(ids, () => {
            this.updates.decrease('home')
        })

        this.emit('readNotification', ids)

    }

    readAllNotifications(){
        this.updates.clear('home')

        this.emit('readAllNotifications', ids)
    }

    notification(notification){

        this.updates.increase('home')

        if (this.vm.$route.name != 'index')
            this.store.commit('addNotification', notification) 

        this.emit('notification', notification)
    }

    filehandler(blob, p = {}){

        if (!p.forcedownload){
            if (blob.type == 'application/pdf') return this.vueapi.pdfviewer({
                blob,
                name : p.name
            })

            if (blob.type.indexOf('image') > -1) {

                return f.Base64.blobToBase64(blob).then(b64 => {

                    var images = new Images()

                    return images.wh(b64).then(i => {

                        return this.vueapi.gallery([{
                            src : b64,
                            ... i
                        }])

                    })
                    
                })
                
            }
        }


        return f.download(blob, p.name)

    }

}

export default Core
