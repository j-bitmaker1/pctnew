import { mapState } from 'vuex';
import appmenu from "@/components/modules/appmenu/index.vue";
import topmenu from "@/components/modules/appmenu/topmenu/index.vue";

import camera from "@/components/common/camera/index.vue";

import actual from "@/components/modules/notifications/actual/index.vue";
import fx from "@/components/assets/fx/index.vue";

export default {
	name: 'root',
	props: {
	},

	data : function(){

		return {
			loading : false,
			blockTouch : false,
			isRouterAlive : true,
			refreshPosition : 0,

			dropfile : false
		}

	},
	components : {appmenu, camera, fx, actual, topmenu},
	created (){
		
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		
		auth : state => state.auth,
		gallery : state => state.gallery,
		globalpreloader : state => state.globalpreloader,
		online : state => state.online,
		iconshow: function() {
			return this.$store.state.icon ? true : false
		},

		candrop : function(){
			return !this.camera && !this.globalpreloader && this.auth && !this.gallery
		},

		camera : state => state.camera,
		fx : state => state.fx,
		theight : state => state.theight,
		tscrolly : state => state.tscrolly,
		//summaryview : state => state.summaryview,

		summaryview : function(){
			return this.$route.name == 'summary' || !this.$route.name
		},

		directions : function(){

			var distance = 100

			return this.auth == 1 && window.cordova ? {
				bottom: {
					distance,
					direction: 'bottom',
	
					constraints : (e) => {
						return this.tscrolly == 0
					},

					clbk : (v, d) => {
						
						var p = v / distance

						this.refreshPosition = p * 100
					}
				}
			} : null
		} 
		
	}),

	methods : {
		closeCamera : function(){
			this.$store.commit('CLOSE_CAMERA')
		},

		refresh : function(){
			this.isRouterAlive = false
			this.$nextTick(() => (this.isRouterAlive = true))

			this.core.api.checkUpdates()
			this.core.updates.synk()
		},


		closeGallery: function () {
            this.$store.commit('GALLERY', null)
        },
	},
}