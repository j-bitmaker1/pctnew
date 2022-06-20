import { mapState } from 'vuex';
import themeToggle from "@/components/assets/themetoggle/index.vue";
import _ from 'underscore';
import f from '@/application/shared/functions.js'

export default {
	name: 'appmenu',
	props: {
	},

	components : {
		themeToggle
	},

	data : function(){

		return {
			loading : false,

			allitems : [
				{
					route : '/',
					id : 'home',
					text : 'menu.home',
					icon : "fas fa-bell"
				},
				{
					route : '/clients',
					id : 'clients',
					text : 'menu.clients',
					icon : "fas fa-users",

					features : ['CRM'],

					childrens : ['/client']
			
				},

				{
					id : 'menu',
					text : 'menu.menu',
					icon : "fas fa-ellipsis-v",
					mobile : true,
					action : this.menu
				},

				{
					route : '/leads',
					id : 'leads',
					text : 'menu.leads',
					icon : "fas fa-user-plus",

					features : ['CRM'],

					childrens : ['/lead']
				},
				{
					route : '/portfolios',
					id : 'portfolios',
					text : 'menu.portfolios',
					icon : "fas fa-suitcase",

					childrens : ['/portfolio', '/compare']
				},

				{
					route : '/compare',
					id : 'compare',
					text : 'menu.compare',
					icon : "fas fa-list-ul",
					mobile : false
				},

				{
					route : '/profile',
					id : 'profile',
					text : 'menu.profile',
					icon : "fas fa-user",
					mobile : false
				}
			]
		}

	},

	created : () => {

	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,

		active : function(){

			var path = this.$route.path


			var r = _.find(this.items, function(i){
				
				if(i.route == '/') return path == i.route

				return path.indexOf(i.route) > -1 || (i.childrens && _.find(i.childrens, (i) => {
					return path.indexOf(i) > -1
				}))
			})

			if(r) return r.id

			return ''
		},

		items : function(state){

			var mobile = f.mobileview()

			return _.filter(this.allitems, (item) => {
				return (typeof item.mobile == 'undefined' || item.mobile == mobile) && (!item.features || _.find(item.features, (f) => {
					return state.features[f]
				}))
			})

		}
	}),

	methods : {
		notifications : function(id){
			var c = this.$store.state.updates[id] || 0

			return Math.min(c, 99)
		},
		/*signout : function(){
			this.core.user.signout()
			this.$router.push('/')
		},*/

		open : function(item){
			if(item.route) {
				this.$router.push(item.route)
			}

			if(item.action) item.action()
		},

		menu : function(){
			this.core.vueapi.fastmenu()
		}
	},
}