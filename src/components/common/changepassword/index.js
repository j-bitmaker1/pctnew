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
			password : '',
			confirmpassword : '',
			oldpassword : ''
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
		canchange : function(){
			return this.canenternew && this.password == this.confirmpassword && this.password
		},

		canenternew : function(){
			return false
		}
	}),

	methods : {
		showerror : function(e){

			this.$message({
				title : "Error",
				message : JSON.stringify(e),
				zIndex : 2900
			})
		},  
		back : function(){
			this.$router.go(-1)
		},
		changePassword : function(v){
			this.password = v
		},

		change : function(){
			this.$root.user.changePassword(this.password).then(d => {
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
			}).catch(this.showerror)
		}
	},
}