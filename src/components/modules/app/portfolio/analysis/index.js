import { mapState } from 'vuex';

import linenavigation from "@/components/assets/linenavigation/index.vue";
import factoranalysis from "../factoranalysis/index.vue";

export default {
	name: 'portfolios_analysis',
	props: {
		portfolio : Object
	},

	components : {
		linenavigation,
		factoranalysis
	},

	data : function(){

		return {
			loading : false,
			navigation : [
				{
					text : 'labels.factoranalysis',
					id : 'factoranalysis',
					icon : 'fas fa-th'
				}
			],
			navkey : 'm',
			navdefault : 'factoranalysis',

			assets : [],
			assetsinfo : {}
		}

	},

	created : function(){
		//this.get()
	},

	watch: {

	},
	computed: mapState({
		auth : state => state.auth,
		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},
		module : function(){
			return this.active
		}
	}),

	methods : {
		get : function(){

			
		},

	},
}