import { mapState } from 'vuex';
import cpassword from 'vue-password-strength-meter'
export default {
	name: 'changepassword',
	props: {
	},

	components : {
		cpassword
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