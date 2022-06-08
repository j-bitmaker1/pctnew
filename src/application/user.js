var _ = require('underscore');
var sha1 = require('sha1');
var Fingerprint2 = require('fingerprintjs2')
var { error } = require('./error')
var moment = require('moment');
import f from './functions'
import Activity from './lib/activity'
import Storage from './utils/cryptoStorage'

var User = function ({
    vm,
    api,
    wss,
    pct, 
    crm,
    vxstorage,
    i18n,
    cordovakit,
    vueapi,
    settings,
    updates
}) {

    console.log("api", api)


    var self = this
    var storage = null

    const salt = process.env.VUE_APP_SALT;
    const prefix = process.env.VUE_APP_PREFIX;
    const fingerPrintDefault = '111finger111';
    const lskey = 'defaultCryptoKey'

    self.locale = 'en-US'


    var fcmNotification = null;
    var device = localStorage['device'] || f.makeid(); localStorage['device'] = device;
    var fingerprint = ''

    self.info = {}

    self.features = {}

    self.activity = new Activity({
        api,
        user : self,
        i18n
    })

    var verify = function(){

        return new Promise((resolve, reject) => {

            self.hasFaceid().then(() => {

                var resolved = false

                cordovakit.faceid.verify().then(code => {

                    if(resolved) return

                    vm.$store.commit('CLOSE_MODAL', 'modal_pincode')

                    resolved = true

                    resolve(code)

                })

                vueapi.pincode('enter', 3, function(code){

                    var tempstorage = new Storage(code)
        
                    try{
                        tempstorage.getItem(prefix + '-token')
                        return Promise.resolve()
                    }
                    catch(e) {
                        return Promise.reject()
                    }
        
                }).then((code) => {

                    if(resolved) return

                    resolved = true

                    resolve(code)

                }).catch(e => {

                    reject(e)
                })

            }).catch(reject)

        })
        
    }

    var getstorage = function(){

        if(storage) return Promise.resolve(storage)


        return verify().catch(e => {
            return Promise.resolve(lskey)
        }).then(password => {

            storage = new Storage(password)

            return Promise.resolve(storage)

        }).catch(e => {
            return Promise.reject(e)
        })
    }

    var changestorage = function(){

        var lui = null
        if (storage) {

            try{
                lui = storage.getItem('ui')
            }catch(e){}
            

            storage.clear()
            storage = null
        }

        return getstorage().then( r => {
            return state.is()
        }).then(state => {

            if(state == 1){

                if (lui)
                    storage.setItem('ui', lui)

                login.save()
                token.save()
                //// set pwd to new storage
            }

        })
    }

    self.setfaceid = function(){

        return self.faceIdAvailable().then(() => {
            return state.is()
        }).then(state => {

            if (state != 1) return Promise.reject('unauthorized')

            return vueapi.pincode('create')

        }).then(code => {

            vm.$store.commit('globalpreloader', true)

            return cordovakit.faceid.set(code).then((r) =>{

                vm.$store.commit('globalpreloader', false)
                return Promise.resolve(r)
            }).catch(e => {

                vm.$store.commit('globalpreloader', false)
                return Promise.reject(e)
            })
        }).then(r => {
            return changestorage()
        })
    }

    self.deletefaceid = function(){

        return cordovakit.faceid.remove().then(r => {

            localStorage.removeItem('askedfaceid')

            return changestorage()
        }).catch(e => {
            console.error(e)

            return Promise.reject(e)
        })

    }

    self.hasFaceid = function(){
        return cordovakit.faceid.has()
    }

    self.faceIdAvailable = function(){
        return cordovakit.faceid.available()
    }

    self.askfaseid = function(){

        return cordovakit.faceid.available().then((type) => {

            return cordovakit.faceid.has().catch(e => {
                if (localStorage['askedfaceid']){
                    return Promise.resolve()
                }

                return vm.$dialog.confirm(
                    vm.$t('common.usefaceid_' + type), {
                    okText: vm.$t('yes'),
                    cancelText : vm.$t('no')
                })
        
                .then((dialog) => {

                    return self.setfaceid().then(r => {

                        vueapi.fx({
                            name : 'emoji',
                            
                            parameters : {
                                from : {
                                    y : (500),
                                    x : window.innerWidth / 2
                                },
            
                                to : {
                                    y : 'top',
                                    x : 'right'
                                }
                            }
            
                        })

                        return Promise.resolve()
                    }).catch(e => {
                        console.error('e', e)
                    })

                }).catch( e => {
                    console.error("E", e)
                    localStorage['askedfaceid'] = true
                })


            })
            
        })
    }


    var state = {

        _value: -1,

        set value(v) {

            this._value = v;

            vm.$store.commit('auth', this.value)
        },

        get value() {
            return this._value
        },

        is: function () {

            switch (this._value) {
                case -1:

                    if(!token.check()){
                        this.value = 0;
                        return Promise.resolve(this.value)
                    }
                    
                    return getstorage().then(() => {
                        pwdhash.init()
                        token.init()
                        login.init()

                        if ((login.value && pwdhash.value) || token.value) {

                            return signin({

                                pwdhash_value: pwdhash.value,
                                login_value: login.value,
                                token_value: token.value

                            }).catch(e => {
                                return Promise.resolve(state.value)
                            })

                        }
                        else {
                            this.value = 0;

                            return Promise.resolve(this.value)
                        }

                        
                    }).catch(e => {
                        console.error('e', e)
                        this.value = 0;

                        return Promise.resolve(this.value)
                    })

                    break;

                case 0:
                case 1:
                    return Promise.resolve(this.value)

                case 2:

                    var t = this

                    return new Promise((resolve, reject) => {

                        setTimeout(function () {
                            resolve()
                        }, 50)

                    }).then(function () {
                        return t.is()
                    })

                default:
                    this.value = -1;

                    return this.is()
            }
        }

    };

    var pwdhash = {
        _value: "",
        get value() {
            return this._value
        },
        set value(v) {
            if (v) {

                this._value = v;
            }
            else {

            }
        },

        init: function () {

        }
    };

    var login = {
        _value: "",

        get value() {
            return this._value
        },

        set value(v) {
            if (v) {

                this._value = v;

                this.save()

            }

            else {
                storage.removeItem(prefix + '-login');
            }
        },

        init: function () {
            this._value = storage.getItem(prefix + '-login') || "";
        },

        save : function(){
            if (this._value)
                storage.setItem(prefix + '-login', this._value);
        }
    };

    var token = {
        _value: "",
        get value() {
            return this._value
        },
        set value(v) {

            if (v) {

                this._value = v;
                storage.setItem(prefix + '-token', v);

            }
            else {

                this._value = ''
                storage.removeItem(prefix + '-token');

            }

        },

        save : function(){
            if (this._value)
                storage.setItem(prefix + '-token', this._value);
        },

        init: function () {
            this._value = storage.getItem(prefix + '-token') || "";
        },

        check : function(){
            return localStorage.getItem(prefix + '-token') || "";
        }
    };

    function crypt(password) {
        return sha1(password + salt)
    }

    function startFcm() {
        if (window.cordova) {

            var settoken = function () {
                FirebasePlugin.getToken(function (fcmToken) {

                    if (!localStorage[prefix + '-fcm'] || localStorage[prefix + '-fcm'] !== fcmToken) {

                        api.notifications.register({ token : fcmToken, device }).then(r => {
                            localStorage[prefix + '-fcm'] = fcmToken;
                        })

                    }

                }, function (error) {
                });

                var channel = {
                    id: "my_channel_id",
                    sound: 'ringtone',
                    vibration: [500, 200, 500],
                    light: true,
                    lightColor: parseInt("FF0000FF", 16).toString(),
                    importance: 4,
                    badge: false,
                    visibility: 1
                };

                FirebasePlugin.createChannel(channel,

                    function () {
                    },
                    function (error) {
                    });
            }

            if (!fcmNotification) {

                FirebasePlugin.hasPermission(function (hasPermission) {

                    if (!hasPermission) {
                        FirebasePlugin.grantPermission(function (hasPermission) {

                            if (hasPermission) {
                                settoken()
                            }

                        });
                    }
                    else {
                        settoken()
                    }

                });

                fcmNotification = FirebasePlugin.onMessageReceived((payload) => {
                    wss.fromPush(payload)
                });
            }

        } else {

        }
    }

    function extendA({ headers, data, system, formData }) {

        var extendedobj = headers

        if (system == 'pct') extendedobj = data

        /*data.fingerprint = fingerprint
        data.device = device*/

        if (state.value != 1) {
            return Promise.resolve({ headers, data, system })
        }

        if (token.value) {

            if (extendedobj)
                extendedobj.Token = token.value

            if(formData){
                formData.append('token', token.value)
            }
        }

        else {
            if (extendedobj){
                if (login.value) extendedobj.Login = login.value
                if (pwdhash.value) extendedobj.password = pwdhash.value
            }
            
        }
        if (extendedobj){
            extendedobj.fingerPrint = fingerprint
        }

        if(formData){
            formData.append('fingerPrint', fingerprint)
        }

        return Promise.resolve({ headers, data, system })
    }

    function extendWss(data) {

        /*data.fingerprint = fingerprint
        data.device = device*/

        if (state.value != 1) {
            return Promise.resolve(data)
        }

        if (token.value) {
            data.token = token.value
        }

        else {

            if (login.value) data.login = login.value
            if (pwdhash.value) data.password = pwdhash.value
        }

        data.fingerPrint = fingerprint


        return Promise.resolve(data)
    }

    function extendU(data, system) {

        if (state.value > 0) {
            (data.new_token || data.token || data.Token) ? token.value = (data.new_token || data.token || data.Token) : '';
        }

    }

    function setFingerPrint() {

        if (typeof window != 'undefined') {

            if (!fingerprint) {

                fingerprint = localStorage['fingerprint'] || ''

                if (!fingerprint) {

                    return Fingerprint2.getPromise({}).then(function (components) {

                        var values = components.map(function (component) { return component.value })
                        fingerprint = Fingerprint2.x64hash128(values.join(''), 31)

                        localStorage['fingerprint'] = fingerprint

                        return Promise.resolve(fingerprint)
                    })

                }

            }

        }

        return Promise.resolve(fingerprint || fingerPrintDefault)

    }

    function signout() {

        var prs = [self.deletefaceid()]

        if (window.cordova)
            prs.push(api.notifications.revoke({ device }).then(r => {
                localStorage.removeItem(prefix + '-fcm')

                return Promise.resolve()
            }))

        vm.$store.commit('globalpreloader', true)

        return Promise.all(prs).catch(e => {
            return Promise.resolve()
        }).then(r => {

            console.log("CLEAR???")

            clear()
            wss.destroy()

        }).finally(() => {
            vm.$store.commit('globalpreloader', false)
        })

    }

    function clear() {

        console.log("CLEAR@")

        api.clearCache()

        vxstorage.clear()

        updates.clearall()

        vm.$store.commit('clearall')

        if (storage)
            storage.removeItem('ui')

        state.value = 0
        pwdhash.value = ''
        login.value = ''
        token.value = ''

        self.info = {}
        self.features = {}
    }

    function signup({
        password_value,
        login_value,
        data_value
    }) {

        var en = false
        var data = {}

        if (password_value && login_value) {

            data.pwdhash = crypt(password_value)
            data.login = login_value

            en = true;
        }

        data.data = JSON.stringify(data_value || {})

        if (en) {

            self.deletefaceid()

            return api.user.signup(data).then(sdata => {

                pwdhash.value = data.pwdhash
                login.value = data.login

                return self.signin({
                    pwdhash_value: pwdhash.value,
                    login_value: login.value
                })

            })

                .then(() => {

                    return state.value

                }).catch(e => {

                    state.value = 0

                    return Promise.reject(e)

                })

        }

        state.value = 0

        return Promise.reject(error(511))

    }

    function signin({
        password_value,
        login_value,
        pwdhash_value,
        token_value
    }) {

        var en = false

        var data = {}

        return getstorage().then(() => {
            return setFingerPrint()
        }).then(fp => {

            fingerprint = fp

            if (((password_value || pwdhash_value) && login_value) || token_value) {

                if (token_value) {
                    data.token = token_value
                }
                else {
                    data.password = pwdhash_value || crypt(password_value)
                    data.login = login_value
                }

                data.fingerPrint = fingerprint


                en = true;
            }

            if (en) {
                state.value = 2

                return api.user.signin(data).catch(e => {

                    if(!e.code || e.code != 401){
                        var altinfo = storage.getItem('ui')

                        if (altinfo){
                            return Promise.resolve(altinfo)
                        }
                    }

                    return Promise.reject(e)
                })
            }

            state.value = 0

            return Promise.reject(error(511))

        }).then(result => {

            console.log("HEHRE")

            

            try {
                startFcm();
            } catch (e) { 

                console.error('e', e)
            }


            state.value = 1

            pwdhash.value = data.password
            login.value = data.login

            self.info = result

            storage.setItem('ui', result)

            vm.$store.commit('userinfo', self.info)

            //settings.getall()

            return api.checkUpdates()

            return self.askfaseid().catch(e => {
                return Promise.resolve()
            })

        }).then(() => {

            self.prepare()

            updates.synk()

            wss.init()

            return state.value

        }).catch(e => {

            console.log("E", e)

            state.value = 0

            return Promise.reject(e)
        })
    }

    self.prepare = function(){

        return Promise.all([self.activity.load(), pct.prepare(), crm.prepare()]).catch(e => {
            console.error(e)
            return Promise.reject(e)
        })

    }

    self.changePassword = function(pwd){
        pwd = crypt(pwd)

        return api.account.password.change(pwd).then(result => {

            if (result.data.changed)

                pwdhash._value = pwd

            return Promise.resolve(result.data)

        })
    }

    self.checkPassword = function(pwd){
        return crypt(pwd) == pwdhash._value
    }


    self.api = {
    }

    self.state = state

    self.extendA = extendA
    self.extendU = extendU
    self.extendWss = extendWss

    self.signin = signin
    self.signup = signup
    self.signout = signout

    self.crypt = crypt

    wss.clbks.open.user = function () {

        state.is().then(state => {
            if (state == 1) wss.registration().catch(e => {
                console.error(e)
            })
        })

    }

    self.id = function(){
        return state.is().then(state => {
            if(self.info) {
                return Promise.resolve(self.info.ID)
            }

            return Promise.reject('info')
        })
    }

    return self

}



export default User