import { mapState } from 'vuex';
import card from "@/components/assets/user/card/index.vue";
import themeToggle from "@/components/assets/themetoggle/index.vue";


export default {
	name: 'profile',
	props: {
	},

	components : {card, themeToggle},

	data : function(){

		return {
			loading : false,
			faceIdAvailable : false,
			hasFaceid : 'no',

			faceId : [
				{
					icon : "fas fa-lock",
					id : 'use',
                    good : true
				},
				{
					icon : "fas fa-times",
					id : 'no'
				}
			],
		}

	},

	created() {
		this.checkFaceId()
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
			this.core.user.signout()
			this.$router.push('/')
		},

		checkFaceId : function(){
			this.core.user.faceIdAvailable().then((type) => {
				this.faceIdAvailable = type

				return this.core.user.hasFaceid()
			}).then(r => {
				this.hasFaceid = 'use'
			}).catch(e => {
				this.hasFaceid = 'no'
			})
		},

		changeFaceId : function(v){

			var a = null

			if (v == 'use'){
				a = this.core.user.setfaceid()
			}

			if(v == 'no'){

				a = vm.$dialog.confirm(
                    vm.$t('common.removefaceid_' + type), {
                    okText: vm.$t('yes'),
                    cancelText : vm.$t('no')
                })
        
                .catch(() => {})
			}

			a.then(() => {

				
				this.checkFaceId().catch(e => {
					console.error(e)
				})
			})
		}
	},
}