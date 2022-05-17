var _ = require('underscore');
var sha1 = require('sha1');
var Fingerprint2 = require('fingerprintjs2')
var { error } = require('./error')
var moment = require('moment');
import f from './functions'

var User = function ({
    vm,
    api,
    wss,
    pct, 
    crm,
    vxstorage
}) {

    var self = this

    const salt = process.env.VUE_APP_SALT;
    const prefix = process.env.VUE_APP_PREFIX;
    const fingerPrintDefault = '111finger111';


    var fcmNotification = null;
    var device = localStorage['device'] || f.makeid(); localStorage['device'] = device;
    var fingerprint = ''

    self.info = {}

    self.features = {}

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

                //localStorage.setItem(prefix + '-pwdhash', v);
            }
            else {
                //localStorage.removeItem(prefix + '-pwdhash');
            }
        },

        init: function () {
            //this._value = localStorage[prefix + '-pwdhash'] || "";
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

                localStorage.setItem(prefix + '-login', v);

            }

            else {
                localStorage.removeItem(prefix + '-login');
            }
        },

        init: function () {
            this._value = localStorage[prefix + '-login'] || "";
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
                localStorage.setItem(prefix + '-token', v);

            }
            else {

                this._value = ''
                localStorage.removeItem(prefix + '-token');

            }

        },
        init: function () {
            this._value = localStorage[prefix + '-token'] || "";
        }
    };

    function crypt(password) {
        return sha1(password + salt)
    }


    function startFcm() {
        if (window.cordova) {

            var settoken = function () {
                FirebasePlugin.getToken(function (fcmToken) {

                    if (!localStorage[prefix + 'fcm'] || localStorage[prefix + 'fcm'] !== fcmToken) {

                        api.user.sendFcmInfo({ fcmToken }).then(r => {
                            localStorage[prefix + 'fcm'] = fcmToken;
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

                    if (_.isEmpty(payload)) return

                    try {

                        if (payload.settings) payload.settings = JSON.parse(payload.settings)
                        if (payload.payload) payload.payload = JSON.parse(payload.payload)
                        if (payload.info) payload.info = JSON.parse(payload.info)

                    }
                    catch (e) {
                    }

                    //// notification self.ws.handleNotifications(payload);

                });
            }

        } else {

            /*var firebaseConfig = config.firebaseConfig;

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            const messaging = firebase.messaging();

            messaging.getToken().then(fcmToken => {
                return api.user.sendFcmInfo({ fcmToken });
            }).then(r => {
                messaging.onMessage((payload) => {
                    Notification.requestPermission()
                        .then(permission => permission === 'granted' ? new Notification(payload.notification.body) : false);
                });
            })*/



        }
    }

    function extendA({ headers, data, system }) {

        var extendedobj = headers

        if (system == 'pct') extendedobj = data

        /*data.fingerprint = fingerprint
        data.device = device*/

        if (state.value != 1) {
            return Promise.resolve({ headers, data, system })
        }

        if (token.value) {
            extendedobj.Token = token.value

            //if(system == 'pct')  extendedobj.Login = 'maximgrishkov@yandex.ru' ////TODO
        }

        else {

            if (login.value) extendedobj.Login = login.value
            if (pwdhash.value) extendedobj.password = pwdhash.value
        }

        extendedobj.fingerPrint = fingerprint


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

        clear()

        wss.destroy()

    }

    function clear() {
        localStorage.removeItem(prefix + 'fcm');


        //vm.$store.commit('userinfo', null)
        //vm.$store.commit('userprofile', null)
        vm.$store.commit('clearall')



        state.value = 0
        pwdhash.value = ''
        login.value = ''
        token.value = ''

        self.info = {}
        self.features = {}

        vxstorage.clear()
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

        return setFingerPrint().then(fp => {

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

                return api.user.signin(data)
            }

            state.value = 0

            return Promise.reject(error(511))

        }).then(result => {

            api.clearCache()

            try {
                startFcm();
            } catch (e) { 

                console.error('e', e)
            }


            state.value = 1

            pwdhash.value = data.password
            login.value = data.login

            self.info = result

            vm.$store.commit('userinfo', self.info)

            self.prepare()

            return state.value

        }).then(() => {

            wss.init()

            return state.value

        }).catch(e => {


            state.value = 0

            return Promise.reject(e)
        })
    }

    self.prepare = function(){

        return Promise.all([pct.prepare(), crm.prepare()]).catch(e => {
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

    return self

}



export default User