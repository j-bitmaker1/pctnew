import { mapState } from 'vuex';
import Master from '@/application/lib/common/ai.js';
import f from "@/application/shared/functions.js"
import aievent from './event/index.vue'
import masterpanel from './masterpanel/index.vue'
import contents from './contents/index.vue'
import {
    MonteCarlo,
} from "@/application/charts/index.js"
export default {
    name: 'ai',
    props: {
        pip : Boolean,
        initialcontext : Object
    },

    components : {
        aievent,
        masterpanel,
        contents
    },

    data : function(){

        return {

            context : {},
            recognition : null,
            masters : {},
            eventsall : {},
            loadings : {},
            currentSession : null,
            fromtextinput : false,

            eventsToRender : [],
            rendered : {},
            eventsinaction : {},
            textareavalue : '',

            events_heights : {},
            events_willremoving : {},
            events_removing : {},
            events_removed : {},

            nospeechrecognition : false,
            speech : false,
            currentStatus : null,

            fadeout : false,
            fadeoutend : false

        }

    },

    beforeDestroy (){
        if(this.recognition) this.recognition.abort()
    },

    created () {

        if(this.initialcontext) this.context = this.initialcontext

        this.initmaster(() => {

        })

        this.getextradata({
            client : 414380,
            portfolio : 15
        }).then(data => {
            console.log("EXTRADATA", data)
        })

        this.helpers_initrecognition()

    },

    watch: {

        textareavalue : function(){
            this.helpers_textareasize()
        },

        currentStatus : function(){
            this.$refs.masterpanel.scrollLeft = this.$refs.masterpanel.scrollWidth
        }
        //$route: 'getdata'
    },
    computed: mapState({

        mobileview : state => state.mobileview,
        auth : state => state.auth,

        inputactive : function(){
            return this.textareavalue ? true : false
        },

        currentEvents : function(){
            return _.filter(this.eventsToRender, (event) => {
                if(event.hidden) return
                if(event.data.shadow) return
                if(this.events_removed[event.id]) return

                return true
            })
            
        },

        events : function(){
            if (this.currentSession){
                return this.eventsall[this.currentSession]
            }

            return []
        },

        master : function(){
            if (this.currentSession){
                return this.masters[this.currentSession]
            }

            return null
        },


        loading : function(){
            if (this.currentSession){
                return this.loadings[this.currentSession]
            }

            return false
        },

        chatstopped : function(){
            return this.master ? this.master.stopped || false : false
        },

        

        masterSettings : function(){
            return {

                user : {
                    name : this.core.user.info.FName,
                    aiadmin : this.core.user.info.Email == 'maximgrishkov@yandex.ru' || 
                        this.core.user.info.Email == 'dsatchkov@rixtrema.com' || 
                        this.core.user.info.Email == 'yperullo@rixtrema.com' || 
                        this.core.user.info.Email == 'astarodubtsev@rixtrema.com'
                },

                template : {
                    list : () => {
                        return this.core.api.ai.template.list()
                    }
                },

                ai : {
                    generate : (templateId, parameters = {}, context = {}, extra = {}) => {


                        return this.getextradata(context).then((data) => {

                            extra = {...extra, ...data}

                            return this.core.api.ai.generate(templateId, parameters, context, extra)
                        }).catch(e => {

                            return Promise.reject(e)
                        })

                    },
                    pdf : (parameters = {}, context = {}, extra = {}) => {
                        return this.core.api.ai.pdf(parameters, context, extra)
                    }
                },

                actions : {
                    sendToComplience : function(result, clbk){
                        clbk('error')
                    },

                    sendEmail : (portfolio, client, result, clbk) => {

                        this.core.campaigns.sendSingle({

                            caption : result.caption,
                            body : result.text,
                            profile : client

                        }).catch(e => {}).finally(() => {
                            clbk('')
                        })

                        
                    },

                    close : () => {
                        this.$emit('close')
                    }
                },

                helpers : {
                    getportfolio : (id, clbk) => {

                        this.core.api.pctapi.portfolios.get(id).then(r => {
                            clbk(r)
                        })

                        
                    },

                    getclient : (id, clbk) => {
                        return this.core.api.crm.contacts.gets({Ids : [id]}).then(c => {
                            clbk(c[0])
                        })
                    }, 

                    getfile : (id, clbk) => {

                        id = id.replace('rxfile:', '')

                        return this.core.api.files.get(id).then(c => {
                            clbk(c)
                        })
                    }, 

                    uploadfile : (clbk) => {

                        var fv = false

                        this.core.vueapi.fileManager({
                            open : function(file){
                                fv = true
                                clbk('rxfile:' + file.id)
                            },
                            
                        }, {
                            close : function(){
                                console.log("CLOSE")
                                if(!fv){
                                    clbk('')
                                }
                            }
                        })
                    }

                    
                },

                answers : {
                    portfolio : (selectclbk, ready, context = {}) => {

                        var lasts = this.core.activity.getlastsByType('portfolio', 10) || []

                        var answers = [{
                            text : "Find portfolio",
                            style : 'main',
                            dictionary : ['lookup', 'select', 'find'],
                            needfill : true,
                            action : (clbk) => {

                                var wr = null
    
                                this.core.vueapi.selectPortfolios((portfolios) => {
                                    var portfolio = portfolios[0]

                                    this.core.activity.template('portfolio', portfolio)

                                    wr = true

                                    selectclbk(clbk, portfolio.id, portfolio.name, portfolio.crmContactId)

                                }, {
                                    one : true,

                                    close : () => {
                                        if(wr) return
                                        
                                        wr = true
                                        
                                        selectclbk(clbk, null)
                                    }
                                })
                            },
        
                            clbk : function(){
        
                            }
        
                        }].concat(_.map(lasts, (meta) => {

                            var portfolio = meta.data.portfolio

                            return {
                                dictionary : [],
                                text : portfolio.name,
                                action : (clbk) => {
                                    this.core.api.pctapi.portfolios.get(portfolio.id).then(r => {

                                        this.core.activity.template('portfolio', r)

                                        /*return this.core.api.crm.contacts.gets({Ids : [r.crmContactId]}).then(c => {
                                            this.profile = c[0]
                                        })*/

                                        selectclbk(clbk, r.id, r.name, r.crmContactId)

                                    })
                                },
                                clbk : () => {

                                    
                                }
                            }
                        }))

                        ready(answers)
                    },

                    client : (selectclbk, ready) => {
                        var answers = []

                        var lasts = [].concat(this.core.activity.getlastsByType('client') || [], this.core.activity.getlastsByType('lead') || []) 
                        var answers = [{
                            text : "Select contact",
                            style : 'main',
                            dictionary : ['lookup', 'select', 'find'],
                            needfill : true,
                            action : (clbk) => {

                                var wr = null
    
                                this.core.vueapi.selectContacts((contacts) => {
                                    var contact = contacts[0]

                                    wr = true

                                    selectclbk(clbk, contact.ID, contact.FName + ' ' + contact.LName)

                                }, {
                                    one : true,

                                    close : () => {

                                        if(wr) return
                                        
                                        wr = true
                                        
                                        selectclbk(clbk, null)
                                    }
                                })
                            },
        
                            clbk : function(){
        
                            }
        
                        }].concat(_.map(lasts, (meta) => {

                            var contact = meta.data.profile

                            return {
                                dictionary : [],
                                text : contact.FName + ' ' + contact.LName,
                                action : (clbk) => {

                                    selectclbk(clbk, contact.ID, contact.FName + ' ' + contact.LName)

                                },
                                clbk : () => {

                                    
                                }
                            }
                        }).concat([
                            {
                                type : 'parameter',
                                text : "Proceed without client",
                                dictionary : ['without', 'empty'],
                                action : function(clbk){
            
                                    selectclbk(clbk, null)
            
                                }
                            }
                        ]))

                        ready(answers)
                    }
                }

            }
        }
    }),

    methods : {

        getextradata : function(context){
            return this.core.getaidata(context)
        },
       
        componentscrolling : function(e){
            this.$emit('componentscrolling', e)
        },  
        startnewchat : function(){
            this.helpers_clearpaneQuestion(() => {

                this.renders_clearpane(() => {
                    this.initmaster(() => {
                    })
                })

            })
        },

        selectchat : function(chat){

            this.helpers_clearpaneQuestion(() => {

                var data = null

                var promises = [
                    this.renders_clearpane_pr(), 

                    this.core.api.ai_chats.get(chat.id).then(function(c){
                        data = c
                    }).catch(function(e){
                        console.error(e)
                        sitemessage(e)
                    })

                ]


                Promise.all(promises).then(() => {

                    this.initmaster(() => {
                        setTimeout(() => {
                            this.helpers_scrolltofinish()
                        }, 300)
                    }, data)

                })

            })
        },
        
        showmenu : function(){
            this.core.vueapi.openaimenu({}, {
                startnewchat : this.startnewchat,
                selectchat : this.selectchat
            })
        },

        add_common : function(data = {}, type, master){

            var event = {
                id : f.makeid(),
                sid : null,
                saving : false,
                data, 
                type,
                hidden : false,
                session : master.session
            }

            if(!this.eventsall[master.session]) {
                this.$set(eventsall, master.session, [])
            }

            this.eventsall[master.session].unshift(event)

            return event
        },

        add_message : function(data, master){
            return this.add_common(data, 'message', master)
        },

        add_html : function(data, master){
            return this.add_common(data, 'html', master)
        },

        add_intro : function(data, master){
            return this.add_common({}, 'intro', master)
        },

        add_parameter : function(data, master){
            return this.add_common(data, 'parameter', master)
        },

        setloading : function(value, session){
            this.$set(this.loadings, session, value ? true : false)
        },

        helpers_scrolltoend : function(){

            var eventsel = this.$refs['events'] 
            var events = eventsel?.children[0]?.children || []
            var d = 0

            if (events.length){
                d = events[0].offsetHeight + 200
            }

            if (eventsel)
                eventsel.scrollTop = eventsel.scrollHeight - d

            //el.eventsContainer.scrollTop(el.eventsContainer.prop('scrollHeight') - d)
        },

        helpers_scrolltofinish : function(){

            var eventsel = this.$refs['events'] 
            var events = eventsel?.children[0]?.children || []
            var d = 0


            if (eventsel)
                eventsel.scrollTop = eventsel.scrollHeight

        },

        helpers_textareasize : function(){

            var input = this.$refs['input']

            if(this.textareavalue){
                input.style.height = 1 + "px";
                input.style.height = (input.scrollHeight || input.style.scrollHeight) + "px";
            }
            else{
                input.style.height = 34 + "px";
            }

            
        },


        helpers_voiceInput : function(event){

            if(!this.recognition) return

            if (event){
                const speechRecognitionList = new SpeechGrammarList();
                this.recognition.grammars = speechRecognitionList;
            }

            this.recognition.start();
        
        },

        helpers_recognitionpermissions : function(){

            if(!window.cordova) return Promise.resolve()

            return new Promise((resolve, reject) => {
                function error(e) {
    
                    reject('Permission to use the microphone has not been obtained.')
                }
                function success() {
                    
                        resolve()
                    
                }
    
                this.core.media.permissions({ audio: true }).then(success).catch(error)
            })

            
        },

        helpers_initrecognition : function(){

            var constructor = window.SpeechRecognition || window.webkitSpeechRecognition

            if(!constructor){

                this.nospeechrecognition = true

                return
            }

            var recognition = new (constructor)();

            var fixedtextvalue = ''

            recognition.lang = 'en-US';
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            recognition.onaudiostart = () => {
                this.speech = true
                fixedtextvalue = this.textareavalue
            };

            recognition.onaudioend = (event) => {
                this.speech = false
            };

            recognition.onresult = (event) => {

                var hasfinal = false
                var text = _.map(event.results, function(result){

                    if (result.isFinal){
                        hasfinal = true
                    }

                    return result[0].transcript

                }).join(' ')

                this.textareavalue = (fixedtextvalue ? fixedtextvalue + " " : "") + text

                console.log('hasfinal', hasfinal, event, fixedtextvalue)
                
                /*if (hasfinal){
                    this.actions_answer(text)
                }*/

            };

            recognition.onend = (event) => {
                console.log('onend', event)
                //this.textareavalue = ''
            };

            this.recognition = recognition
        },

        renders_clearpane_pr : function(){
            return new Promise((resolve, reject) => {
                this.renders_clearpane(resolve)
            })
        },

        renders_clearpane : function(clbk){


            window.requestAnimationFrame(() => {
                this.fadeout = true
                this.fadeoutend = true
            })

            setTimeout(() => {

                window.requestAnimationFrame(() => {
                    
                    
                    this.currentSession = null
                    this.currentStatus = null
                    this.eventsToRender = []

                })

                setTimeout(() => {
                    this.fadeout = false

                    window.requestAnimationFrame(() => {
                        setTimeout(() => {
                            this.fadeoutend = false
                        }, 300)

                        if(clbk) clbk()
                    })

                }, 500)

            }, 300)
        },

        helpers_clearpaneQuestion : function(clbk){
            var master = this.master

            if (master.stopped || !master.stage.cansave){
                clbk()
                return
            }

            return this.vm.$dialog.confirm(
                "This action will end the current chat, continue?", {
                okText: 'Continue',
                cancelText : 'Cancel'
            })
    
            .then((dialog) => {

                clbk()

            }).catch( e => {
                
            })
        },

        actions_masterEvents : function(master, clbk){

            this.setloading(true, master.session)

            master.nextEventsPrepare((masterEvents) => {
                var added = []

                _.each(masterEvents, (masterEvent) => {
                    added.push(this['add_' + masterEvent.type](masterEvent.event, master))
                })
                
                this.setloading(false, master.session)


                if(clbk) clbk(added)
            })

        },

        actions_addnext : function(master, clbk){

            this.actions_masterEvents(master, (added) => {

                var areversed = added.reverse()

                this.renders_lazyevents(areversed, () => {

                    if(areversed[0] && areversed[0].data.justsay){

                        this.actions_addnext(master, clbk)

                    }
                    else
                        if(clbk) clbk()

                    this.history_chatautosave(master).then((changes) => {
                        //this.renders_autosavechanges(changes)
                    })

                }, master)
                

            })
        },

        actions_getlastEventAnswer : function(){
            return _.find(this.events, function(event){
                return !event.hidden && (event.data.answers || event.data.textanswer)
            })
        },

        actions_getanswer : function(text = '', event){

            var lastevent = event || this.actions_getlastEventAnswer()

            var val = 0.65

            if (lastevent){

                if(lastevent.data.answers){

                    var answers = _.filter(_.map(lastevent.data.answers, function(a){
                        var dictionary = [].concat(a.text, a.dictionary || [])

                        var e = _.max(dictionary, function(w){

                            return f.stringEq(text, w)

                        }) 

                        return {
                            answer : a,
                            
                            value : f.stringEq(text, e)
                        }
                    }), function(a){
                        return a.value > val
                    })

                    if(!answers.length) {

                        if(lastevent.data.textanswer){
                            return {
                                needpromt : false,
                                event : lastevent,
                                answer : lastevent.data
                            }
                        }

                        return null
                    }

                    var answer = _.max(answers, function(a){
                        return a.value
                    })

                    if (answer){

                        return {
                            needpromt : f.stringEq(text, answer.answer.text) < val,
                            event : lastevent,
                            answer : answer.answer
                        }

                    }

                }

                else{
                    if(lastevent.data.textanswer){
                        return {
                            needpromt : false,
                            event : lastevent,
                            answer : lastevent.data
                        }
                    }
                }

            }
        },

        actions_answer : function(text, event, clbk){

            var master = this.master

            f.retry(() => {
                return !this.loading
            }, () => {
                var ae = this.actions_getanswer(text, event)

                this.textareavalue = ''


                if (ae){

                    var cl = (text) => {
                        
                        if(!ae.event.data.nothide)
                            ae.event.hidden = true

                        this.renders_removeHidden(() => {
                            
                            this.renders_lazyevents(text ? [this.add_message({
                                message : text,
                                you : true
                            }, master)] : [], () => {

                                if (ae.answer.clbk){
                                    ae.answer.clbk(text)
                                }

                                if(!ae.answer.donotcontinue){
                                    this.actions_addnext(master, clbk)
                                }
            
                            }, master)
                        })
                    }

                    if (ae.answer.action){

                        this.setloading(true, master.session)

                        this.$set(this.eventsinaction, ae.answer.answerid, true)

                        ae.answer.action((label) => {

                            this.setloading(false, master.session)

                            this.$set(this.eventsinaction, ae.answer.answerid, false)

                            if(!ae.answer.needfill || label) cl(label)

                        }, text)
                    }
                    else{
                        cl(text + (ae.needpromt ? " ("+ae.answer.text+")" : ''))
                    }

                    

                    return
                }

                else{

                    var lastevent = event || this.actions_getlastEventAnswer()


                    this.renders_removeHidden(() => {
                        var yourmessage = this.add_message({
                            message : text,
                            you : true,
                            //removeThisAndNext : true
                        }, master)

                        var re = [yourmessage]

                        if (lastevent){

                            var unrecognizedMessage = this.add_message({
                                message : "I'm sorry, I didn't understand, please repeat"
                            }, master)

                            re.unshift(unrecognizedMessage)
                            re.unshift(lastevent)
                        }

                        this.renders_lazyevents(re, function(){

                            if(clbk) clbk()

                        }, master)
                    })

                }

                
            })
            
        },

        actions_simpleMasterEventsAdd : function(masterEvents, master, clbk){

            if(master.session != this.currentSession) return

            var added = []

            _.each(masterEvents, (masterEvent) => {
                added.push(this['add_' + masterEvent.type](masterEvent.event, master))
            })
            
            var areversed = added.reverse()

            this.renders_lazyevents(areversed, () => {

            
                if(clbk) clbk()

                this.history_chatautosave(master).then(function(changes){
                    //renders.autosavechanges(changes)
                })

            }, master)

        },

        actions_eventActions: function(events, clbk){

            var wasaction = false
            var waserror = false
            var needfocus = false

            f.lazyEach({
                sync : true,
                array : events,
                action : (p) => {

                    var event = p.item

                    if (event.data.textanswer){
                        needfocus = true
                    }

                    if(!event.data.action){
                        p.success()
                    }
                    else{

                        event.data.action({
                            before : function(hardoperation){


                            },
                            clbk : function(error, ps = {}){

                                wasaction = true

                                if (error) waserror = error

                                if (ps.hide){ event.hidden = true }

                                p.success()

                            }
                        })
                    }
                    
                },

                all : {
                    success : function(){
                        if (clbk)
                            clbk(wasaction, needfocus, waserror)
                    }
                }
            })

        },

        renders_autosavechanges: function(changes){

        },

        renders_type : function(event, clbk){

            var str = f.convertNewLinesToBr(event.data.message)

            var i = 0
            var text = ''
            var isTag = false

            //var hashtml = /<\/?[a-z][\s\S]*>/i.test(text)

            var typeWriter = () => {

                text = str.slice(0, ++i);

                if(!document.hasFocus()){

                    this.$set(event.data, 'visiblepart', str)

                    if(clbk) clbk()

                    return;
                }

                if (text === str) {

                    this.$set(event.data, 'visiblepart', text)

                    if(clbk) clbk()

                    return;
                }

                var char = text.slice(-1);

                if( char === '<' ) isTag = true;
                if( char === '>' ) isTag = false;

                if (isTag) return typeWriter();

                this.$set(event.data, 'visiblepart', text)

                setTimeout(typeWriter, 10);
                
            }

            typeWriter()
				
        },

        renders_effectin : function(events, clbk){

            f.lazyEach({
                sync : true,
                array : events,
                action : (p) => {

                    var event = p.item
                    

                    if (event.type == 'message'){

                        if (!event.data.you && !event.data.fast && !event.data.shadow){

                            this.renders_type(event, () => {
                                this.$set(this.rendered, event.id, true)
                                p.success()

                            })
                        }
                        else{
                            this.$set(this.rendered, event.id, true)
                            this.$set(event.data, 'visiblepart', f.convertNewLinesToBr(event.data.message))
                            p.success()
                        }

                    }

                    else{
                        this.$set(this.rendered, event.id, true)

                        p.success()
                    }

                },

                all : {
                    success : function(){
                        if (clbk)
                            clbk()
                    }
                }
            })

        },

        renders_removeHidden : function(clbk){

            var rm = false

            var hevents = _.filter(([].concat(this.events)).reverse(), function(event){

                if (event.removedFromInterface) return false

                if (event.hidden || event.data.shadow){
                    return true
                }

                if (event.data.removeThisAndNext){
                    rm = true
                }

                return rm

            }).reverse()

            _.each(hevents, function(event){
                event.removedFromInterface = true
            })

            if (hevents.length){
                _.each(hevents, (event) => {

                    var el = this.$refs['event_' + event.id]

                    if (el && el.length){
                        this.events_heights[event.id] = el[0].getheight()
                    }

                    requestAnimationFrame(() => {
                        this.events_willremoving[event.id] = true
                    })

                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            this.events_willremoving[event.id] = false
                            this.events_removing[event.id] = true
                        })
                    }, 200)
                    

                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            this.events_removed[event.id] = true
                        })
                    }, 400)
                })

                setTimeout(function(){
                    requestAnimationFrame(function(){
                        if(clbk) clbk()
                    })
                }, 600)
            }

            else{
                if(clbk) clbk()
            }
            
        },

        renders_events : function(events, clbk, replace){

            events = _.filter(events, (event) => {
                return event.session == this.currentSession
            })

            if (!events.length){
                if(clbk) clbk()

                return 
            }

            events = _.map(events, (event) => {
                return {...event}
            })
            
            _.each(events, (e, i) => {
                e.modkey = i + (replace ? 0 : this.eventsToRender.length)
            })

            if (replace){

                this.eventsToRender = events

                _.each(events, event => {
                    this.$set(this.rendered, event.id, true)
                    this.$set(event.data, 'visiblepart', f.convertNewLinesToBr(event.data.message))
                })

                if (clbk){
                    clbk(false, false, false)
                }

                return
            }

            _.each(events, (event) => {
                this.eventsToRender.unshift(event)
            })

            this.setloading(true, events[0].session)

            setTimeout(() => {
                this.helpers_scrolltoend()

                this.renders_effectin(events, () => {

                    this.renders_removeHidden(() => {

                        this.actions_eventActions(events, (wasaction, needfocus, waserror) => {

                            setTimeout(() =>{
                                this.setloading(false, events[0].session)
                                
                                if (clbk){
                                    clbk(wasaction, needfocus, waserror)
                                }

                            }, 300)

                        })
                    })

                })
            }, 300)

            return

        },

        renders_lazyevents(events, clbk, master){
            events = _.filter(events, function(e){return e})

            events = _.clone(events).reverse()

            var wasaction, needfocus, waserror;

            this.currentStatus = master.status()

            //renders.masterpanel()

            f.lazyEach({
                sync : true,
                array : events,
                action : (p) => {
                    this.renders_events([p.item], function(_wasaction, _needfocus, _waserror){
                        if(_wasaction) wasaction = true
                        if(_needfocus) needfocus = true
                        if(_waserror) waserror = _waserror

                        p.success()
                    })
                },

                all : {
                    success : () => {
                        this.eventsclbk(clbk, wasaction, needfocus, waserror, master)
                    }
                }
            })
        },

        eventsclbk : function(clbk, wasaction, needfocus, waserror, master){

            var thissession = master.session == this.currentSession

            if (waserror){
                master.displayerror = waserror
            }

            if ((needfocus || this.fromtextinput) && thissession){

                this.fromtextinput = false

                setTimeout(() => {

                    if(!f.isMobile()){
                        this.$refs['input'].focus()
                    }
                }, 100)
                
            }

            ////////////////TODO
            if (wasaction && thissession){
                this.actions_addnext(master, clbk)
            }
            else{
                if(clbk) clbk()
            }
        },

        initchat : function(clbk, afterprepare){

            var master = this.master

            this.add_intro({}, master)

            this.setloading(true, master.session)

            var f = () => {
                this.actions_addnext(master, clbk)
            }

            var c = (fast) => {

                //renders.masterpanel()

                this.setloading(false, master.session)

                

                if(fast){

                    this.renders_events(this.events, () => {

                        //helpers.scrolltoend()
                
                        this.eventsclbk(f, false, false, false, master)

                    }, true)

                }
                else{
                    this.renders_lazyevents(this.events, f, master)
                }

            }

            master.prepare(() => {

                if (master.session != this.currentSession) return

                if (afterprepare){
                    afterprepare(c)
                }
                else{
                    c()
                }

                
            })
        },

        hideevent : function(event){
            event.hidden = true
            this.eventsToRender = _.filter(this.eventsToRender, (e) => {
                return e.id != event.id
            })
        },

        deletefile: function(fileid, event){
            this.master.removefile(fileid)

            this.hideevent(event)

            this.actions_addnext(this.master, () => {
                
            })
        },

        clickanswer : function({text, event}){
            this.actions_answer(text, event)
        },

        textareakeyup : function(event){
            this.textareavalue = event.target.value

            var text = f.trim(event.target.value).replace(/^\s+|\s+$/g, '')

            if(!text){

                if (event.keyCode === 40) {

                    event.preventDefault()

                    return false
                }

                if (event.keyCode === 38) {

                    var mylastevent = _.find(this.events, function(event){
                        return event.type == 'message' && event.data.you
                    })

                    if (mylastevent && mylastevent.data.message){

                        this.textareavalue = mylastevent.data.message

                        event.preventDefault()

                        return false
                    }
                    
                    
                }

            }
            else{

                if ((event.keyCode == 10 || event.keyCode == 13)){

                    if (event.ctrlKey){
                        this.textareavalue = text + '\n'
                        return false
                    }
                    else{


                        this.fromtextinput = true
                        this.actions_answer(text)

                        event.preventDefault()
                        event.stopPropagation()

                        return false
                    }
                }

                
            }
        },

        attach : function(){    

            if(this.loading) return

            this.core.vueapi.fileManager({
                open : (file) => {
                    console.log("file,", file)

                    var master = this.master

                    var message = this.add_message({
                        message : 'rxfile:' + file.id,
                        you : true
                    }, master)

                    master.addfile('rxfile:' + file.id)

                    console.log('message', message)

                    var re = [message]

                    this.renders_lazyevents(re, function(){

                    }, master)
                }
			}, {
				
			})
        },

        sendClick : function(){
            this.actions_answer(this.textareavalue)
        },

        microphoneClick : function(){

            if (this.speech){

                if (this.recognition)
                    this.recognition.abort()
            }
            else{

                if(this.loading) return

                this.helpers_recognitionpermissions().then(() => {
                    this.helpers_voiceInput()
                }).then(e => {

                    this.$message({
						title : "An error has occurred",
						message : e
					})

                })
 
                
            }
                
        },

        changemaster : function({type, data}){
            if(this.loading || !this.master) return

            if(type == 'parameter'){
                this.master.actions.cancelparameter(data)
            }

            if(type == 'portfolio'){
                this.master.actions.cancelportfolio()
            }

            if(type == 'client'){
                this.master.actions.cancelclient()
            }

            if(type == 'type'){
                this.master.actions.changetype()
            }

            this.currentStatus = this.master.status()

            this.actions_addnext(this.master)
        },

        startover : function(){
            if(this.loading || !this.master) return

            this.master.actions.restart()

            this.currentStatus = this.master.status()

            this.actions_addnext(this.master)
        },

        initmaster : function(clbk, data){

            var master = null

            this.currentStatus = null

            if(data){

                master = _.find(this.masters, function(master){
                    return master.id == data.chat.id
                })

                if(!master){
                    master = new Master(this.masterSettings, this.context)

                    master.recall(data.chat.currentState)
                    
                    master.id = data.chat.id
                    master.stopped = true

                }

                /// TODO
                ///master.context
            }
            else{
                master = new Master(this.masterSettings, this.context)
            }

            master.hooks.wantsay.main = (events) => {
                this.actions_simpleMasterEventsAdd(events, master)
            }



            this.$set(this.masters, master.session, master)
            this.$set(this.eventsall, master.session, [])

            this.currentSession = master.session
            this.eventsToRender = []

            this.initchat(clbk, (clbk) => {

                if(data && data.messages && data.messages.length){
                    
                    _.each(data.messages, (message) => {

                        var event = {}

                        if(message.type == 'message'){
                            event = this.add_message({
                                message : message.content,
                                you : message.role == 'USER' ? true : false
    
                            }, master)
                        }
                        
                        if(message.type == 'html'){
                            event = this.add_html({
                                html : message.content
                            }, master)
                        }


                        event.sid = message.id
                        event.session == master.session

                    })

                    if(clbk) clbk(true)

                }
                else{
                    if(clbk) clbk()
                }

            })
        },

        history_load : function(clbk, reload){
            this.core.api.ai_chats.list(reload).then(function(history){
                if(clbk) clbk(history)
            }).catch(function(e){
                console.error(e)
                if(clbk) clbk([])
            })
        },
    
        history_add : function(title, state, clbk){
            this.core.api.ai_chats.add(title, state).then(function(id){
                if(clbk) clbk(id)
            }).catch(function(e){
                console.error(e)
                if(clbk) clbk()
            })
        },
    
        history_update : function(title, state, clbk){
            this.core.api.ai_chats.add(title, state).then(function(id){
                if(clbk) clbk(id)
            }).catch(function(e){
                console.error(e)
                if(clbk) clbk()
            })
        },
    
        history_chatautosave : function(master){
            var fillingstatus = master.fillingstatus()
            var status = master.status()
    
            var changes = {
                events : [],
                state : false,
                added : false
            }
    
            console.log('status', fillingstatus, status)
    
            if (fillingstatus == 'draft'){
                return Promise.resolve(changes)
            }
    
            if (fillingstatus == 'saving'){
                return Promise.resolve(changes)
            }
    
            if (fillingstatus == 'stopped'){
                return Promise.resolve(changes)
            }
    
            var promises = []
    
            if (fillingstatus == 'clean'){
                promises.push(
                    () => {
    
                        master.saving = true
    
                        return this.core.api.ai_chats.add(status.title, status).then(function(id){
    
                            master.id = id
    
                            changes.state = true
                            changes.added = true
    
                        }).finally(function(){
                            
                            master.saving = false
                        })
                    }
                )
            }
    
            if (fillingstatus == 'cleansaved'){
    
                promises.push(
                    () => {
    
                        master.saving = true
    
                        return this.core.api.ai_chats.update({
                            title : status.title,
                            id : master.id,
                            currentState : status
                        }).then(function(){
    
                            changes.state = true
    
                        }).finally(function(){
                            master.saving = false
                        })
                    }
                )
    
                
            }
    
            _.each(
                _.filter([].concat(this.events).reverse(), function(event){
                    if(event.hidden) return false
                    if(event.data.shadow) return false
                    if(event.saving) return false
                    if(event.sid) return false
                    if(event.cantsave) return false
                    if(event.type != 'message' && event.type != 'html') return false
                    
    
                    return true
    
                }), 
                
                (event) => {
    
                    console.log('send event', event)
    
                    promises.push(
                        () => {
                            event.saving = true
    
                            var data = {
                                chatId : master.id,
                                role : event.data.you ? "USER" : "ASSISTANT",
                                type : event.type,
                                parameters : '',
                                content : event.data.message || event.data.html
                            } 
    
                            return this.core.api.ai_messages.add(data).then(function(id) {
    
                                event.sid = id
    
                                changes.events.push(event.id)
    
                            }).finally(function(){
                                event.saving = false
                            })
                            
                        }
                    )
                }
            )
    
            return new Promise((resolve, reject) => {
    
                f.lazyEach({
                    sync : true,
                    array : promises,
                    action : function(p){
                        p.item().then(function(){
                            p.success()
                        }).catch(function(e){
                            console.error(e)
    
                            p.success()
                        })
                    },
    
                    all : {
                        success : () => {
    
                            /*this.history_load(function(history){
    
                                //renders.chatshistory(history)
    
                            }, changes.added)*/
    
                            resolve(changes)
                        }
                    }
                })
    
    
            })
        }
    },

    

    
}