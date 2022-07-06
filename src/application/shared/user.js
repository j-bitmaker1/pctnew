var _ = require('underscore');
var sha1 = require('sha1');
var Fingerprint2 = require('fingerprintjs2')
var { error } = require('./error')

import f from './functions'
import Storage from './cryptoStorage'

var User = function ({
    vm,
    api,
    wss,
    cordovakit,
    vueapi,
    updates,
    
}, {prepare, clearing}) {



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

    
    self.product = [
        {id : "CRM", trial : true, name : "CRM features", description : "Manage your clients and leads"},
        {id : "PCT", trial : true, name : "PCT features", description : "Advanced risk profiling and capacity features"},
        {id : "CAMPAIGN", name : "Campaigns features", description : "Build up long relationship with clients and follow up leads to close sales with engaging marketing emails"}
    ]

    

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

            clear()
            wss.destroy()

        }).finally(() => {
            vm.$store.commit('globalpreloader', false)
        })

    }

    /*function clearSignin(){
        api.clearCache()

        vxstorage.clear()

        updates.clearall()

        self.info = {}
        features()
    }*/

    function clear() {

        clearing()

        if (storage)
            storage.removeItem('ui')

        state.value = 0
        pwdhash.value = ''
        login.value = ''
        token.value = ''

        self.info = {}
        features()

       
    }


    function signup(data = {}){
        if(!data.Email || !data.Password) return Promise.reject('emptydata')


        //data.Password = crypt(data.Password)

        return api.user.register(data).then(r => {

            return signin({
                password_value : data.Password,
                login_value : data.Email
            })
        })
    }

    function signupRixtrema(data = {}){
        if(!data.Email || !data.Password) return Promise.reject('emptydata')

        return api.user.register(data)
    }

    var features = function(info = {}){

        self.features = {}

        _.each(info.Licenses, (l) => {
            if(l.ProductCode){
                self.features[l.ProductCode] = {
                    permissions : l.Permissions,
                    to : l.ValidTo,
                }

                self.features[l.ProductCode].valid = f.date.nowUtc1000() < self.features[l.ProductCode].to / 1000

                
            }
        })

        vm.$store.commit('features', self.features)

    }

    self.extendFeatures = function(license){
        if(!self.info.Licenses) self.info.Licenses = []

        self.info.Licenses = _.filter(self.info.Licenses, (l) => {
            return l.ProductCode != license.ProductCode
        })

        self.info.Licenses.push(license)

        features(self.info)
    }

    self.checkFeatures = function(features){
        return !features || _.find(features, (f) => {
            return self.features[f]
        })
    }

    self.extendByFeatures = function(items){

        return _.filter(items, (item) => {

            return self.checkFeatures(item.features)

        })

    }

    self.extendByFeaturesMenu = function(menu){
        var fs = _.filter(menu, (item) => {

            return self.checkFeatures(item.features)

        })

        if(fs.length) return fs

        return [
            {
                text: 'labels.checkLicence',
                icon: 'fas fa-certificate',
                action: () => {
                    vm.$router.push('/features')
                },
            }
        ]
    }

    function signin({
        password_value,
        login_value,
        pwdhash_value,
        token_value
    }) {

        var en = false

        var data = {}

        //clearSignin()

        vm.$store.commit('globalpreloader', true)

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

            try {
                startFcm();
            } catch (e) { 

                console.error('e', e)
            }


            state.value = 1

            pwdhash.value = data.password
            login.value = data.login

            self.info = result

            features(result)

            storage.setItem('ui', result)

            vm.$store.commit('userinfo', self.info)

            //settings.getall()


            prepare()

        }).then(() => {

            updates.synk()

            wss.init()

            vm.$store.commit('globalpreloader', false)

            return state.value

        }).catch(e => {

            vm.$store.commit('globalpreloader', false)


            state.value = 0

            return Promise.reject(e)
        })
    }


    self.init = function(){
        self.inited = true
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
    self.signup = signupRixtrema
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

    self.getinfo = function(){
        return state.is().then(state => {
            if(self.info) {
                return Promise.resolve(self.info)
            }
        })
    }

    return self

}



export default User