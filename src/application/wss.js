import ReconnectingWebSocket from 'reconnecting-websocket';
import f from './functions'
import moment from 'moment'
import {Contact, Portfolio} from './lib/kit.js'

var WSS = function(core, url, system){
    var self = this

    var rws = null; 
    var checkInterval = null;

    self.lastevent = null;
    
    self.state = {

        wssready : {
            v : false,
            set value(_v){
                this.v = _v

                core.vm.$store.commit('wssready', this.v)

            },

            get value(){
                return this.v
            }
        },

        opened : {
            v : false,
            set value(_v){
                this.v = _v
            },

            get value(){
                return this.v
            }
        },
    }

    var handled = {}

    var clbks = {

    }

    var authsend = function(message, p){
        if (core.user){

            return core.user.state.is().then(state => {

                if(state){

                    return core.user.extendWss(message).then(message => {
                     
                        return send(message);

                    })

                }

                return Promise.resolve()

            })

        }

        return Promise.reject()

    }

    var ready = function(){
        if (rws){
        
            return f.pretry(function(){

                return self.state.opened.value

            }, 50, 3000).then(() => {

                if(!self.state.opened.value){
                    return Promise.reject()
                }

            })
        }

        return Promise.reject('ready')
    }

    var send = function(message, p){

        if(!p) p = {}

        return ready().then(() => {

            message.requestId = f.makeid()

            try{
                rws.send(JSON.stringify(message));
            }
            catch(e){
                return Promise.reject(e)
            }

            
            return new Promise((resolve, reject) => {

                if (message.requestId)

                    clbks[message.requestId] = {
                        resolve, reject,
                        time : f.date.addseconds(null, 5)
                    }

                else{
                    resolve()
                }

            })
        })
 
    }

    var pingpong = function(){
        return ready().then(() => {

            rws.send('0');

            return new Promise((resolve, reject) => {

                clbks['pingpong'] = {

                    resolve, reject,
                    time : f.date.addseconds(null, 3)

                }

            })
        })
    }

    

    var registration = function(clbk){

        return authsend({
            action : 'register',
            appids : 'net.rixtrema.pct'
        }, function(data){
            
            if (data.registered) {
                self.state.wssready.value = true
            }

            if(clbk) clbk()
        })
       
    }

    /*var handleNotifications = function(message){

        message.payload || (message.payload = {})
        message.settings || (message.settings = {})

        if (handledNotifications[message.notification]) return
            handledNotifications[message.notification] = true

        function clickHandler() {
            var c = f.deep(actions, message.action + '.click') || f.deep(actions, `notification.${message.type}.click`)

            
            if (c) c(message.payload)
        }

        if(message.tap) {
            clickHandler();
        }

        else{

            if(message.payload.nothandle) return

            p.vm.$message({

                title : message.info.title,
                message : message.info.message,
                iconImg : message.info.icon || null,
                onClick : clickHandler,
                zIndex : 2900,
                supportHTML : true,
                wrapperClassName : "notificationWrapper",
                type : 'info'
        
            })

            if (message.settings.sound){
                /// TODO  insert new sound
    
                if (p.platform.voice && !p.platform.voice.playingnow()){
                    p.platform.voice.signal()
                }
            }
        }

        
       
        if(!message.ignoredb)
            p.vm.$store.commit('unseenincrease', 'notifications');

        _.each(message.settings.actions || [], function(a){

            handleMessages({
                action : a,
                data : message.payload
            })

        })

    }*/


    var handleMessages = function(_message){
        var message = {}

        self.lastevent = new Date()

        if (_message == '1') {

            if (clbks['pingpong']){
                clbks['pingpong'].resolve()

                delete clbks['pingpong']
            }

            return
        }

        if(_.isObject(_message)){
            message = _.clone(_message)
        }
        else{

            try{ message = JSON.parse(_message); }catch(e){}
        }

        if(message.eventid){
            if (handled[message.eventid]){
                return
            }

            handled[message.eventid] = true
            message.id = message.eventid
        }


        if(!message.data){
            message.data = {}
        }

        if (message.requestId && clbks[message.requestId]){

            clbks[message.requestId][message.Result == 'success' ? 'resolve' : 'reject'](message.data)

            delete clbks[message.requestId]

            return

        }

        if(message.isSystem){
            if (message.Type == 'Update'){

                var types = []
                var data = message.Data

                

                if(message.x_eventType == 'LEADUPDATE') {types = ['client', 'lead']; data = new Contact(data)}
                if(message.x_eventType == 'CATALOGUPDATE') types = ['filesystem']
                if(message.x_eventType == 'PORTFOLIOUPDATE') {types = ['portfolio']; data = new Portfolio(data)}


                

                core.updateByWs(data, types)

                ///LEADUPDATE CATALOGUPDATE PORTFOLIOUPDATE
            }   

            if (message.x_eventType == 'READEVENTS'){

                console.log('message', message)

                console.log('readNotification', message.Ids)

                core.readNotification(message.Ids || [])

                return
            }
        }
        else{

            /*core.notifier.message({

                title : message.title || "New Notification",//core.vm.$e('common.newnotification'),
                message : message.body,
                image : message.image,
                icon : message.icon,

                eventId : message.eventid,

                actions : message.Actions
            })*/

            core.notification(message)
        }

        /*if(!message.action) return

        if (f.deep(actions, message.action))
            var promise = f.deep(actions, message.action).a(message, message.error)
            
            if (promise)
                promise.then(r => {

                    if (message.data.notification){
                        message.data.action = message.action
                        handleNotifications(message.data, r)
                    }

                })*/

    }
    

    var actions = {

        notification : {
         
            test : {
                a : function(message){
                    return Promise.resolve()
                },

                click : function(data){
                    core.vm.$router.push('/mynotifications')
                }
            }
            
        },

       

        registered : {
            a : function(message){

                if (message.data.registered) {
                    self.state.wssready.value = true
                }

                return Promise.resolve()
            }
        },

    
    }

    self.destroy = function(){
        self.state.opened.value = false
        self.lastevent = null

        if (checkInterval) {
            clearInterval(checkInterval)

            checkInterval = null
        }

        if (rws){
            rws.close()
            rws = null
        }
    }
   
    self.init = function(){

        self.destroy()

        rws = new ReconnectingWebSocket('wss://' + url, [], {
            minUptime : 60000,
            connectionTimeout : 12000,
            reconnectionDelayGrowFactor : 1,
            maxReconnectionDelay : 7000,
            minReconnectionDelay : 2000
        });
 
        rws.addEventListener('open', () => {

            self.state.opened.value = true


            _.each(self.clbks.open, function(o, i){
                o()
            })

        });

        rws.addEventListener('message', (message) => {
            handleMessages(message.data || "{}")
        });

        rws.addEventListener('close', (message) => {


            self.state.opened.value = false
            self.state.wssready.value = false

        });

        checkInterval = setInterval(function(){
            self.check()
        }, 135000)

    }

    self.check = function(){
        pingpong().catch(e => {
            self.init()
        })
    }

    self.api = {
       
    }

    self.linkwss = function(){

    }

    self.unlinkwss = function(){

    }

    self.isonline = function(){
        var now = moment()
        var l = now.diff(moment(self.lastevent), 'seconds') < 40000

        return l
    }


    self.clbks = {
        open : {},
    }

    self.authsend = authsend
    self.send = send

    self.registration = registration
    
    self.actions = actions

    /*setInterval(function(){
        self.check()
    }, 35000)*/

    return self
}


export default WSS