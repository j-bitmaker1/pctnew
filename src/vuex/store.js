import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'underscore'


Vue.use(Vuex);

var themes = {
	white: "White",
	black: "Dark",
	classic: "Classic"
}

var mex = {
	theme: function (state, value) {

		if (themes[value]) {
			state.theme = value
		}
	}
}

var activetimeout = null

var store = new Vuex.Store({
	state: {
		icon: null,
		loading: false,
		wssready : false,
		online: true,
		theme: 'white',
		themes: themes,
		globalpreloader: false,
		allnotifications: 0,
		gallery: null,
		share: null,
		modalShowed: null,
		menu: null,
		redirect: '',
		auth : -1,
		lastlogin : '',
		userinfo : {},

		tscrolly : 0,
		tscrollx : 0,
		dscrolly : 0,
		dscrollx : 0,

		theight : 0,
		twidth : 0,
		dheight : 0,
		dwidth : 0

	},
	getters: {

	},
	mutations: {

		clearall(state) {


			state.icon = null
			state.loading = false
			state.online = true
			state.unauthorized = false

			state.globalpreloader = false
			state.allnotifications = 0

			state.gallery = null
			state.modalShowed = null
			state.menu = null
			state.redirect = ''
			state.auth = -1
			state.wssready = false
			
			
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

		wssready(state, value) {
			state.wssready = value;
		},

		redirect(state, value) {
			state.redirect = value;
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

		setmodal(state, v) {
			state.modalShowed = v;
		},

		userinfo(state, v) {
			state.userinfo = v;
		},

		init(state) {
			mex.theme(state, localStorage.getItem('theme') || 'white')

			state.lastlogin = localStorage.getItem('lastlogin')

			state.theight = state.dheight = window.innerHeight
			state.twidth = state.dwidth = window.innerWidth
			
		},

		lastlogin(state, v) {
			state.lastlogin = v;

			localStorage.setItem('lastlogin', v)
		},


		GALLERY(state, v) {
			state.gallery = v || null
		},

		SHARE(state, v) {
			state.share = v || null
		},

		theme(state, value) {
			mex.theme(state, value)
		},

		SET_MENU(state, v) {
			state.menu = v
		}

	},
	actions: {

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
})


export default store;