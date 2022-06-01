

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

class Core {
    constructor(vm, p){
        if(!p) p = {}

        this.vxstorage = p.vxstorage
        this.i18n = p.i18n

        this.apiHandlers = {
            error : function(){},
            success : function(){}
        }

        this.domain = p.domain

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

        this.filemanager = new Filemanager(this)
        this.crm = new CRM(this)
        this.pct = new PCT(this)
        this.fx = new FX(this)

        this.cordovakit = new Cordovakit(this)
        this.vueapi = new Vueapi(this)
        this.user = new user(this)
       
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
        return this.api.invalidateDb(dbIndex, updated, data)
    }

    filehandler(blob, p = {}){

        if (!p.forcedownload){
            if (blob.type == 'application/pdf') return this.vueapi.pdfviewer({
                blob
            })
        }

    }

}

export default Core
