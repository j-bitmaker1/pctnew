import { mapState } from 'vuex';


import bigmainbutton from "@/components/delements/bigmainbutton/index.vue";
import notifications from "@/components/modules/notifications/index.vue";

export default {
	name: 'home',
	props: {
	},

	components : {
		bigmainbutton,
		notifications
	},

	data : function(){

		return {
			loading : false
		}

	},

	created () {
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
	}),

	methods : {
		notifications : function(id){
			
			var c = this.$store.state.updates[id] || 0

			return Math.min(c, 99)
		}
	},
}