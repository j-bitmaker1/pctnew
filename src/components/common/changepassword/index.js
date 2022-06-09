import { mapState } from 'vuex';
export default {
	name: 'changepassword',
	props: {
	},

	components : {
	},

	data : function(){

		return {
			loading : false,
			password : ''
		}

	},

	created : function(){
		
	},

	watch: {
		//$route: 'getdata'
	},

	beforeRouteEnter (to, from, next) {
		next()
	},

	beforeRouteUpdate (to, from, next) {
		next()
	},

	computed: mapState({
		auth : state => state.auth,
	}),

	methods : {
		
		send : function(){

			this.core.api.user.prechangePassword(this.password, {
				preloader : true,
			}).then(r => {

			}).catch(e => {

				this.$store.commit('icon', {
					icon: 'error',
				})
				
			})

		},
		change : function(){
			/*this.$root.user.changePassword(this.password).then(d => {
				if (d.changed){

					this.password = ''
					this.confirmpassword = ''
					this.oldpassword = ''

					this.$store.commit('icon', {
						icon : 'success',
						message : "Password was changed"
					})

					this.back()

				}
				else{
					return Promise.reject("Password hasn't been changed")
				}
			}).catch(this.showerror)*/
		}
	},
}