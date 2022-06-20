import Vue from 'vue'
import Router from 'vue-router'
import f from '@/application/shared/functions.js';
import storeFactory from "@/vuex/store";

var store = storeFactory()

Vue.use(Router);


const redirects = {

	features: function(features, core, to){
		return f.pretry(() => {

			return core.user && core.user.inited

		}).then(() => {

			if(core.user.checkFeatures(features)){
				return Promise.resolve(null)
			}
			else{

				f.pretry(() => {
					return core.vm.$dialog
				}).then(() => {

					core.vm.$dialog.confirm(
						core.vm.$t('labels.accesDeniedLicence'), {
						okText: core.vm.$t('button.ok'),
					}).then((dialog) => {
	
					}).catch( e => {
						
					})

				})
				

				return Promise.reject({
					to: '/features?need=' + features.join(',')
				})
			}
		})
	},

	authorized: function (core, to) {

		var rs = ''

		return f.pretry(() => {
			return core.user && core.user.inited
		}).then(() => {
			return core.user.state.is()
		}).then(state => {

			if (state == 1) {
				return Promise.resolve(null)
			}
			else {

				if (to) {

					var redirect = f.hexEncode(to.query.redirect || to.fullPath);

					store.commit('redirect', redirect);

					rs = '?redirect=' + redirect

				}

				return Promise.reject({
					to: '/authorization' + rs
				})
			}
		})
	},

	redirect: function (core, to) {
		return redirects.authorized(core, to).then(r => {


			if (store.state.redirect) {

				var redirect = f.hexDecode(store.state.redirect)

				store.commit('redirect', '');

				return Promise.resolve({
					to: redirect
				})
			}

			return Promise.resolve(null)

		})
	},

	notauthorized: function (core, to) {
		return f.pretry(() => {
			return core.user && core.user.inited
		}).then(() => {
			return core.user.state.is()
		}).then(state => {

			if (!state) {
				return Promise.resolve(null)
			}
			else {
				return Promise.resolve({
					to: '/'
				})
			}
		})
	},

	check: function (core, to) {
		return f.pretry(() => {
			return core.user && core.user.inited
		}).then(() => {
			return core.user.state.is()
		}).then(state => {

			return Promise.resolve(null)
		})
	}
}

const routes = [
	{
		path: '/',
		name: 'index',
		component: () => import('@/views/index'),
		customRedirect: redirects.redirect
	},

	{
		path: '/authorization',
		name: 'authorization',
		component: () => import('@/views/authorization'),
		customRedirect: redirects.notauthorized
	},

	{
		path: '/profile',
		name: 'profile',
		component: () => import('@/views/profile'),
		customRedirect: redirects.authorized
	},

	{
		path: '/terms',
		name: 'terms',
		component: () => import('@/views/terms')
	},

	{
		path: '/support',
		name: 'support',
		component: () => import('@/views/support'),
		customRedirect: redirects.check
	},

	{
		path: '/faq',
		name: 'faq',
		component: () => import('@/views/faq')
	},

	
	{
		path: '/portfolios',
		name: 'portfolios',
		component: () => import('@/views/portfolios'),
		customRedirect: redirects.authorized,

		features : ['PCT']
	},

	{
		path: '/portfolio/:id',
		name: 'portfolio',
		component: () => import('@/views/portfolio'),
		customRedirect: redirects.authorized,

		features : ['PCT']
	},

	{
		path: '/changepassword',
		name: 'changepassword',
		component: () => import('@/views/changepassword')
	},

	{
		path: '/setpassword',
		name: 'setpassword',
		component: () => import('@/views/setpassword')
	},

	{
		path: '/changepassword',
		name: 'changepassword',
		component: () => import('@/views/changepassword')
	},

	{
		path: '/forgotpassword',
		name: 'forgotpassword',
		component: () => import('@/views/forgotpassword')
	},

	{
		path: '/confirm',
		name: 'confirm',
		component: () => import('@/views/confirm')
	},

	{
		path: '/confirmation',
		name: 'confirmation',
		component: () => import('@/views/confirmation')
	},

	{
		path: '/registration',
		name: 'registration',
		component: () => import('@/views/registration'),
		customRedirect: redirects.notauthorized
	},

	
	
	{
		path: '/compare',
		name: 'compare',
		component: () => import('@/views/compare'),
		customRedirect: redirects.authorized,

		features : ['PCT']
	},

	{
		path: '/leads',
		name: 'leads',
		component: () => import('@/views/leads'),
		customRedirect: redirects.authorized,

		features : ['CRM']
	},

	{
		path: '/explore',
		name: 'explore',
		component: () => import('@/views/explore'),
		customRedirect: redirects.authorized
	},

	{
		path: '/features',
		name: 'features',
		component: () => import('@/views/features'),
		customRedirect: redirects.authorized
	},

	{
		path: '/lead/:id',
		name: 'lead',
		component: () => import('@/views/lead'),
		customRedirect: redirects.authorized,

		features : ['CRM']
	},

	{
		path: '/clients',
		name: 'clients',
		component: () => import('@/views/clients'),
		customRedirect: redirects.authorized,

		features : ['CRM']
	},

	{
		path: '/client/:id',
		name: 'client',
		component: () => import('@/views/client'),
		customRedirect: redirects.authorized,

		features : ['CRM']
	},

	{
		path: '/riskscore/:token',
		name: 'riskscore',
		component: () => import('@/views/riskscore'),
	},


]

const scrollBehavior = function (to, from, savedPosition) {

	const position = {}

	if (to.hash) {
		position.selector = to.hash

		if (document.querySelector(to.hash)) {
			return position
		}

		return false
	}

	return new Promise(resolve => {

		if (to.matched.some(m => !m.meta || !m.meta.dontScrollToTop)) {
			position.x = 0
			position.y = 0
		}


		resolve(position)

	}).catch(e => {
	})
}

const router = new Router({
	base: process.env.BASE_URL,
	routes,
	scrollBehavior,
	mode: window.cordova ? "" : 'history',

})


router.beforeEach((to, from, next) => {

	

	var r = _.find(routes, (r) => r.name == to.name)

	if (r && r.customRedirect) {

		return f.pretry(() => {
			return router.app.core
		}).then(() => {

			router.app.core.store.commit('globalpreloader', true)

			return r.customRedirect(router.app.core, to).then((t) => {

				console.log('r.features', r.features)

				if (r.features){
					return redirects.features(r.features, router.app.core, to)
				}

				return Promise.resolve(t)

			})
		}).catch(obj => {
			return Promise.resolve(obj)
		}).then(obj => {

			router.app.core.store.commit('globalpreloader', false)

			return obj ? next(obj.to) : next()

		}).catch(e => {
			
		})

	}

	next()
})

router.afterEach(() => {
	
})

export default router