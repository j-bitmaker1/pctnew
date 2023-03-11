import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'underscore'


Vue.use(Vuex);

var themes = {
	white: {
		name: 'black', ////ch
		class: "stwhite",
		color: "#ffffff",
		media: '(prefers-color-scheme: light)',
		rootid: ''
	},

	black: {
		name: 'white',
		class: "stblack",
		color: "#1e2235",
		media: '(prefers-color-scheme: dark)',
		rootid: 'black'
	}
}

var mex = {
	theme: function (state, value) {

		if (themes[value]) {
			state.theme = value

			if (document.documentElement.hasAttribute('theme')) {
				document.documentElement.removeAttribute('theme');
			}

			document.documentElement.setAttribute('theme', themes[value].rootid);

			var root = document.querySelector(':root');

			var rootStyles = getComputedStyle(root);

			state.currentStyles = rootStyles

			localStorage.setItem('theme', state.theme)

			/*$('meta[name="theme-color"]').attr('content', themes[value].color)
			$('meta[name="msapplication-navbutton-color"]').attr('content', themes[value].color)
			$('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', themes[value].color)*/
		}
	}
}

var storeFactory = function (vxstorage) {


	var state = {
		icon: null,
		loading: false,
		wssready: false,
		online: true,
		theme: 'white',
		dollars : 'd',
		themes: themes,
		globalpreloader: false,
		allnotifications: 0,
		gallery: null,
		share: null,
		menu: null,
		redirect: '',
		auth: -1,
		lastlogin: '',
		userinfo: {},

		tscrolly: 0,
		tscrollx: 0,
		dscrolly: 0,
		dscrollx: 0,

		theight: 0,
		twidth: 0,
		dheight: 0,
		dwidth: 0,

		currentStyles: {},
		modals: [],
		portfolios: [],
		valuemode: 'd',

		crmschemas: {},
		selection: null,

		camera: null,
		photolibraryaccessdecline: false,
		fx: null,

		notifications: [],

		updates : {},

		features : {},

		uploading : [],
		mobileview : false
	}



	var getters = {
		currentStyleValue: (state) => (id) => {
			return state.currentStyles.getPropertyValue(id)
		},

		currentColorValue: (state, store) => (id) => {
			return (store.currentStyleValue(id) || "").split(', ')
		},

		colorByValue: (state, store) => (value) => {

			var st = '--neutral-grad-0'

			if (value < 0) st = '--color-bad'

			if (value > 0) st = '--color-good'

			return 'rgb(' + store.currentStyleValue(st) + ')'
		}
	}

	var mutations = {

		clearall(state) {

			state.icon = null
			state.loading = false
			state.online = true
			state.unauthorized = false

			state.globalpreloader = false
			state.allnotifications = 0

			state.gallery = null
			state.menu = null
			state.redirect = ''
			state.auth = -1
			state.wssready = false
			state.notifications = []
			//state.modals = []

		},

		photolibraryaccessdecline: function (state, value) {
			state.photolibraryaccessdecline = value
		},

		tscrolly(state, value) {
			state.tscrolly = value;
		},
		tscrollx(state, value) {
			state.tscrollx = value;
		},
		dscrolly(state, value) {
			state.dscrolly = value;
		},
		dscrollx(state, value) {
			state.dscrollx = value;
		},

		theight(state, value) {
			state.theight = value;
		},

		twidth(state, value) {
			state.twidth = value;
			state.mobileview = state.twidth <= 768 ? true : false
		},

		dheight(state, value) {
			state.dheight = value;
		},

		dwidth(state, value) {
			state.dwidth = value;
		},

		wssready(state, value) {
			state.wssready = value;
		},

		redirect(state, value) {
			state.redirect = value;
		},

		updates(state, value) {
			state.updates = value;
		},

		uploading(state, value = []) {
			state.uploading = state.uploading.concat(value);
		},

		clearUploading(state, value) {
			state.uploading = [];
		},

		globalpreloader: function (state, value) {
			state.globalpreloader = value
		},

		icon(state, value) {
			state.icon = value
		},

		auth(state, value) {
			state.auth = value
		},

		valuemode(state, value) {
			state.valuemode = value
		},

		userinfo(state, v) {
			state.userinfo = v;
		},

		crmschemas(state, v) {
			state.crmschemas = v;
		},

		initmodals(state){
			try{
				var modals = JSON.parse(localStorage['savedModals'] || '[]')

				_.each(modals, (modal) => {
					this.commit('OPEN_MODAL', modal)
				})
			}
			catch(e){

			}
		},

		init(state) {
			mex.theme(state, localStorage.getItem('theme') || 'white')

			state.lastlogin = localStorage.getItem('lastlogin')

			state.theight = state.dheight = window.innerHeight
			state.twidth = state.dwidth = window.innerWidth

			state.dollars = localStorage.getItem('dollars') || 'd'
		},

		features(state, v){
			state.features = v
		},

		lastlogin(state, v) {
			state.lastlogin = v;

			localStorage.setItem('lastlogin', v)
		},

		GALLERY(state, v) {
			state.gallery = v || null
		},

		FX(state, v) {
			state.fx = v || null
		},

		SHARE(state, v) {
			state.share = v || null
		},

		theme(state, value) {
			mex.theme(state, value)
		},

		dollars(state, value) {
			state.dollars = value || 'd'

			localStorage['dollars'] = state.dollars
		},

		SET_MENU(state, v) {
			state.menu = v
		},

		OPEN_CAMERA(state, v) {
			state.camera = v
		},

		CLOSE_CAMERA(state) {
			state.camera = null
		},

		PIP_MODAL(state, {id, value}){
			var index = -1 
			var modal = _.find(state.modals, (m, i) => {
				if(m.id == id){
					index = i
					return true
				}
			})

			if (modal){
				modal.pip = value
				Vue.set(state.modals, index, modal)
			}

			this.commit('OVF_HA')
		},

		OVF_HA(state){

			var mdls = _.filter(state.modals, (modal) => {
				return !modal.pip
			})

			var h = document.getElementById('html');

			if (mdls.length) {
				h.style.overflow = 'hidden'
			}
			else{
				h.style.overflow = null
			}

			var saved = _.filter(state.modals, (m) => {
				return m.save
			})

			console.log('saved', saved, state.modals)

			localStorage['savedModals'] = JSON.stringify(saved)
		},

		OPEN_MODAL(state, modal) {

			console.log("STATE", this)

			if(modal.one){
				var last = _.find(state.modals, (m) => {
					return m.id == modal.id
				})

				if(last){
					this.commit('CLOSE_MODAL', modal.id)
				}
			}

			state.modals.push(modal);

			this.commit('OVF_HA')
		},

		CLOSE_MODAL(state, id) {
			state.modals = _.filter(state.modals, function (m) {
				return m.id != id
			})

			this.commit('OVF_HA')
		},

		/// temp
		addportfolio(state, v) {
			state.portfolios.push(v);
		},

		select(state, {

			context = 'general',
			items = {}

		}) {


			if (!state.selection || state.selection.context != context) {

				state.selection = {
					context: context,
					items: {}
				}

			}

			_.each(items, (item) => {
				Vue.set(state.selection.items, item.ID || item.id, item)
			})


		},

		unselect(state, {
			context = 'general',
			items = null
		}) {

			if (!state.selection || state.selection.context != context || !items) {
				state.selection = null
			}

			if (state.selection && items) {
				_.each(items, (item) => {
					Vue.delete(state.selection.items, item.ID || item.id)
				})

				if (_.isEmpty(state.selection.items)) {
					state.selection = null
				}
			}

		},

		removeNotifications(state){
			state.notifications = []
		},

		removeNotification(state, notification){
			state.notifications = _.filter(state.notifications, (n) => {
				return (n.id || n.eventid) != (notification.id || notification.eventid)
			})
		},

		addNotification(state, notification){
			state.notifications.unshift(notification)
		}

	}

	var actions = {

		OPEN_MODAL({ commit }, { modal }) {



			if (!index) index = 0

			if (!images) images = []

			if (images.length) {

				commit('GALLERY', {
					images: images,
					index: index
				})

			} else {
				commit('GALLERY', null)
			}

		},

		SHOW_GALLERY({ commit }, { images, index }) {

			if (!index) index = 0

			if (!images) images = []

			if (images.length) {

				commit('GALLERY', {
					images: images,
					index: index
				})

			} else {
				commit('GALLERY', null)
			}

		},
	}

	if (vxstorage) {
		_.each(vxstorage.storage, function (storage) {
			state['_' + storage.type] = {}

			mutations['_set_' + storage.type] = function (state, obj) {

				Vue.set(state['_' + storage.type], obj[storage.index], obj)
			}

			mutations['_delete_' + storage.type] = function () {
				state['_' + storage.type] = {}
			}

			mutations['_invalidate_' + storage.type] = function (state, index) {

				Vue.delete(state['_' + storage.type], index)


			}
		})
	}

	return new Vuex.Store({
		state,
		getters,
		mutations,
		actions
	})
}

export default storeFactory;