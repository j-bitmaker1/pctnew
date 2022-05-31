import { mapState } from 'vuex';
import appmenu from "@/components/modules/appmenu/index.vue";

import camera from "@/components/common/camera/index.vue";
import fx from "@/components/assets/fx/index.vue";

export default {
	name: 'root',
	props: {
	},

	data : function(){

		return {
			loading : false
		}

	},
	components : {appmenu, camera, fx},
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

		camera : state => state.camera,
		fx : state => state.fx,
		theight : state => state.theight
	}),

	methods : {
		closeCamera : function(){
			this.$store.commit('CLOSE_CAMERA')
		},

		/*fxtest : function(e){

			console.log("E", e.clientY, e.clientX)

			this.core.vueapi.fx({
				name : 'emoji',
			
				parameters : {
					from : {
						y : (e.clientY),
						x : (e.clientX)
					}
				}

			})
			
		}*/
	},
}