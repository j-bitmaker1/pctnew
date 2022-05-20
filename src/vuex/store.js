import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'underscore'


Vue.use(Vuex);

var themes = {
	white: {
		name: 'black', ////ch
		class: "stwhite",
		color : "#ffffff",
		media : '(prefers-color-scheme: light)',
		rootid : ''
	},

	black: {
		name: 'white',
		class: "stblack",
		color : "#1e2235",
		media : '(prefers-color-scheme: dark)',
		rootid : 'black'
	}
}

var mex = {
	theme: function (state, value) {

		if (themes[value]) {
			state.theme = value

			if (document.documentElement.hasAttribute('theme')){
				document.documentElement.removeAttribute('theme');
			}

			document.documentElement.setAttribute('theme', themes[value].rootid);

			var root = document.querySelector(':root');

			var rootStyles = getComputedStyle(root);

			state.currentStyles = rootStyles

			/*$('meta[name="theme-color"]').attr('content', themes[value].color)
			$('meta[name="msapplication-navbutton-color"]').attr('content', themes[value].color)
			$('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', themes[value].color)*/
		}
	}
}

var storeFactory = function(vxstorage){


	var state = {
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
		dwidth : 0,

		currentStyles : {},
		modals : [],
		portfolios : [],
		valuemode : 'd',

		crmschemas : {}

	}

	

	var getters = {
		currentStyleValue : (state) => (id) => {
			return state.currentStyles.getPropertyValue(id)
		},

		currentColorValue : (state, store) => (id) => {
			return (store.currentStyleValue(id) || "").split(', ')
		},

		colorByValue : (state, store) => (value) => {

			var st = '--neutral-grad-0'

			if(value < 0) st = '--color-bad' 

			if(value > 0) st = '--color-good' 

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
			//state.modals = []
			
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
		},

		OPEN_MODAL(state, modal) {
			state.modals.push(modal);

			if (state.modals.length){
				var h = document.getElementById( 'html' );

				h.style.overflow = 'hidden'
			}
		},

		CLOSE_MODAL(state, id){
			state.modals = _.filter(state.modals, function(m){
				return m.id != id
			})

			console.log('state.modals.length', state.modals.length)

			if(!state.modals.length){
				var h = document.getElementById( 'html' );

				h.style.overflow = null
			}
		},

		/// temp
		addportfolio(state, v) {
			state.portfolios.push(v);
		},

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

	if(vxstorage){
		_.each(vxstorage.storage, function(storage){
			state['_' + storage.type] = {}
	
			mutations['_set_' + storage.type] = function(state, obj){
	
				console.log('obj[storage.index]', obj[storage.index], obj)
	
				Vue.set(state['_' + storage.type], obj[storage.index], obj)
			}
	
			mutations['_delete_' + storage.type] = function(){
				state[storage.type] = {}
			}

			mutations['_invalidate_' + storage.type] = function(state, index){

				Vue.delete(state['_' + storage.type], index)

				console.log('index', index, state['_' + storage.type])

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