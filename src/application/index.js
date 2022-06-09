

import Notifier from "./notifier";
import Api from "./api";
import listeners from './listeners'
import f from './functions'
import user from './user'
import wss from './wss'
import CRM from './lib/crm'
import PCT from './lib/pct'
import Vueapi from './vueapi'
import Cordovakit from './cordovakit'
import Filemanager from './lib/filemanager'
import FX from './utils/fx.js'
import {Settings, LSSettings} from "./lib/settings";
import PDFReports from "./lib/pdfreports";
import { _ } from "core-js";
import Updates from "./updates";

class Core {

    clbks = {}

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

            stress : new Settings(this, "STRESS"), 
            user : new Settings(this, "USER"),
            pdf : new Settings(this, "PDF"),
            
            lspdf : new LSSettings(this, "PDF")
        }

        this.filemanager = new Filemanager(this)
        this.crm = new CRM(this)
        this.pct = new PCT(this)
        this.fx = new FX(this)

        this.cordovakit = new Cordovakit(this)
        this.vueapi = new Vueapi(this)


        this.updates = new Updates(this)

        this.api.prepare().then(() => {
            this.user = new user(this)
            this.pdfreports = new PDFReports(this)
        })
       
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

    destroy = function(){
        this.store.commit('clearall')

        this.user.unlinkwss(this.wss)

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

        this.vm.$router.push(route);
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
                this.vxstorage.update(data, type)
            }catch(e){
                console.error(e)
            }
        })

        console.log("invalidate", invalidate)

        this.api.invalidateStorageNow(invalidate)
        
    }

    createByWs(data, type, invalidate = []){

        console.log('createByWs', data, type, invalidate)

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
        }

        return f.download(blob, p.name)

    }

}

export default Core
