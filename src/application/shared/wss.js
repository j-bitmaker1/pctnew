import ReconnectingWebSocket from 'reconnecting-websocket';
import f from './functions.js'
import moment from 'moment'

import {Contact, Portfolio, Scenario, Task, TTask, TFile} from './kit.js'

var WSS = function(core, url){
    var self = this

    var rws = null; 
    var checkInterval = null;

    self.lastevent = null;
    
    self.state = {

        wssready : {
            v : false,
            set value(_v){
                this.v = _v
                
                if (core.vm.$store)
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

    self.broadcast = function(data = {}){
        data.broadcast = true
        return send({
            action: 'broadcast',
            data
        })
    }

    self.fromPush = function(payload){

        if (payload.event_id){
            core.api.notifications.get(payload.event_id).then(r => {
                r.eventid = payload.event_id

                handleMessages(r)
            })
        }
       
    }

    var handleBroadcast = function(data){

        if (data.event == 'settings'){

            data.payload || (data.payload = {})

            var type = (data.payload.type || "").toLowerCase()

            if (core.settings[type]){


                core.settings[type].update().catch(e => {
                })
            }
        }
    }

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

        if (message.broadcast){

            handleBroadcast(message)

            return
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
                var invalidate = []
                var data = message.Data

                if(message.x_eventType == 'LEADUPDATE') {types = ['client']; invalidate = ['contacts']; data = new Contact(data)}

                if(message.x_eventType == 'CLIENTUPDATE') {types = ['client']; invalidate = ['contacts']; data = new Contact(data)}
                
                if(message.x_eventType == 'CATALOGUPDATE') {types = ['filesystem']}

                if(message.x_eventType == 'INTEGRATIONTASKCOMPLETE') {
                    return core.updateIntegrationsByWs();
                }
                
                if(message.x_eventType == 'PORTFOLIOUPDATE') {types = ['portfolio']; invalidate = ['portfolios']; data = new Portfolio(data)}

                if(message.x_eventType == 'BUYLISTUPDATE') {types = ['buylist']; invalidate = ['buylists']; data = new Portfolio(data)}

                if(message.x_eventType == 'CUSTOMSCENARIOUPDATE') {types = ['customscenario']; invalidate = ['customscenarios', 'stress']; data = new Scenario(data)}



                core.updateByWs(data, types, invalidate)

                return

            }   

            if (message.Type == 'Create'){

            

                var invalidate = []
                var data = message.Data
                var type = ''

                if(message.x_eventType == 'LEADUPDATE') {type = 'lead'; invalidate = ['contacts']; data = new Contact(data)}

                if(message.x_eventType == 'CLIENTUPDATE') {type = 'client'; invalidate = ['contacts']; data = new Contact(data)}

                if(message.x_eventType == 'PORTFOLIOUPDATE') {type = 'portfolio'; invalidate = ['portfolios']; data = new Portfolio(data)}
                if(message.x_eventType == 'BUYLISTUPDATE') {types = 'buylist'; invalidate = ['buylists']; data = new Portfolio(data)}

                if(message.x_eventType == 'CUSTOMSCENARIOUPDATE') {type = 'customscenario'; invalidate = ['customscenarios']; data = new Scenario(data)}


                core.createByWs(data, type, invalidate)

            }   

            if (message.type == 'PARSEPORTFOLIO'){

                var invalidate = []
                var data = message
                var type = ''
                var types = []

                    if(message.x_eventType == 'ASYNCTASKCOMPLETED') {
                        types = ['task']; invalidate = ['tasks']; data = new TTask(data)

                        core.updateByWs(data, types, invalidate)
                        return
                    }

                    if(message.x_eventType == 'ASYNCTASKPROGRESS') {
                        types = ['task']; invalidate = ['tasks']; data = new TTask(data)

                        core.updateByWs(data, types, invalidate)
                        return
                    }

                    if(message.x_eventType == 'ASYNCTASKCREATE') {
                        type = 'task'; invalidate = ['tasks']; var task = new TTask(data)

                        core.createByWs(task, type, invalidate)

                        return
                    }


            }

            if (message.x_eventType == 'READEVENTS'){

                if(message.Ids)
                    core.readNotification(message.Ids || [])

                else{
                    core.readAllNotifications()
                }

                return
            }

            if (message.x_eventType == 'FILEUPLOADED'){

                
                return
            }

            if (message.x_eventType == 'FILEDELETED'){

                
                return
            }

            ///// campaigns

            if(
                message.x_eventType == 'CAMPAIGNSTATUSCHANGED' || 
                message.x_eventType == 'STEPCOMPLETED' || 
                message.x_eventType == 'BATCHSTATUSCHANGED' || 
                message.x_eventType == 'TRACKINGIMG'){

                if (core.campaigns)
                    core.campaigns.updateByWs(message)    
            }

            if (message.x_eventType == 'CAMPAIGNSSTATUSCHANGED'){
                var ids = message.campaign_ids.split(',')

                _.each(ids, (id) => {
                    var msg = {...message, ...{campaign_id : id, x_eventType : 'CAMPAIGNSTATUSCHANGED'}}

                    if (core.campaigns)
                        core.campaigns.updateByWs(msg)  
                })
            }

           
        }
        else{

            core.notification(message)
        }

    }
    

    var actions = {

        notification : {
         
            test : {
                a : function(message){
                    return Promise.resolve()
                },

                click : function(data){
                    core.vm.$router.push('/mynotifications').catch(e => {})
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