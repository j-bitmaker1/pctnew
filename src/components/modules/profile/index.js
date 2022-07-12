import { mapState } from 'vuex';
import card from "@/components/assets/user/card/index.vue";
import themeToggle from "@/components/assets/themetoggle/index.vue";
import settings from '../app/settings/index.vue'


export default {
	name: 'profile',
	props: {
	},

	components : {card, themeToggle, settings},

	data : function(){

		return {
			loading : false,
			version : process.env.VUE_APP_VERSION
		}

	},

	created() {
		
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		userinfo : state => state.userinfo
	}),

	methods : {
		signout : function(){
			this.core.user.signout().then(() => {
				this.$router.push('/').catch(e => {})
			})
			
		},

		
	},
}