import Vue from 'vue'
import Router from 'vue-router'
import f from '@/application/functions';
import store from '@/vuex/store';

Vue.use(Router);

const redirects = {
    authorized: function (core, to) {

        var rs = ''

        return f.pretry(() => {
            return core.user
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
            return core.user
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
    }
}

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index'),
        customRedirect : redirects.redirect
    },

    {
        path: '/authorization',
        name: 'authorization',
        component: () => import('@/views/authorization'),
        customRedirect : redirects.notauthorized
    },

    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile'),
        customRedirect : redirects.authorized
    },

    {
        path: '/terms',
        name: 'terms',
        component: () => import('@/views/terms')
    },

    {
        path: '/support',
        name: 'support',
        component: () => import('@/views/support')
    },

    
    {
        path: '/portfolios',
        name: 'portfolios',
        component: () => import('@/views/portfolios'),
        customRedirect : redirects.authorized
    },

    {
        path: '/portfolio',
        name: 'portfolio',
        component: () => import('@/views/portfolio'),
        customRedirect : redirects.authorized
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
        path: '/leads',
        name: 'leads',
        component: () => import('@/views/leads'),
        customRedirect : redirects.authorized
    },

    {
        path: '/clients',
        name: 'clients',
        component: () => import('@/views/clients'),
        customRedirect : redirects.authorized
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
        console.log(e)
    })
}

const router = new Router({
    routes,
    scrollBehavior,
    mode: window.cordova ? "" : 'history',

})


router.beforeEach((to, from, next) => {

    var r = _.find(routes, (r) => r.name == to.name)

    if (r && r.customRedirect) {

        console.log('router.app', router.app.core, to, r)

        return f.pretry(() => {
            return router.app.core
        }).then(() => {

            return r.customRedirect(router.app.core, to)

        }).catch(obj => {

            console.log("OBJ", obj)

            return Promise.resolve(obj)
        }).then(obj => {

            console.log("SA")

            obj ? next(obj.to) : next()
        })

        return
    }

    next()
})

export default router