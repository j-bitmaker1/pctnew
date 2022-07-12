import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"
export default {
	name: 'Authorization',


	data : function(){

		return {
			login : '',
			password : '',
			loading : false
		}

	},

	created : function(){
		this.login = this.$store.state.lastlogin || ''
	},

	watch: {
		//$route: 'getdata'
	},

	computed: mapState({
		auth : state => state.auth,
	}),

	methods : {

		focusedLogin : function(){
		},
	  
		signin : function(){

			this.$store.commit('lastlogin', this.login)

			this.core.api.clearCache()

			this.core.user.signin({

				password_value : this.password,
				login_value :  this.login

			}).then(state => {

				this.$router.push('/').catch(e => {})

			}).catch(e => {

				if(e.code == '401' || e.code == 511){

					this.$message({
						title : "Invalid Access Details",
						message : "Wrong Username or Password"
					})

					return
				}

				if(e.code == 20){
					this.$store.commit('icon', {
						icon: 'error',
						message: "Something went wrong, maybe a connection problem"
					})

					return 
				}

				
				this.$store.commit('icon', {
					icon: 'error',
					message: "Something went wrong."
				})
			})

		},

		keyuplogin : function(v){
			this.login = v.target.value
		},

		changelogin : function(v){
			this.login = v.target.value
		},


		registration : function(){
			this.$router.push('/registration').catch(e => {})
		},

		demo : function(){
			f.openexternallink('https://rixtrema.com/requestdemo/TM?source=pctnew')
		}

	   
	},

	props: {
		caption : String
	},

}