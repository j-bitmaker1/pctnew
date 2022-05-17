import { mapState } from 'vuex';
import action from "@/components/modules/notifications/action/index.vue";
import _ from 'underscore';

export default {
	name: 'notification',
	props: {
		event : {
			type : Object,
			default : () => {return {

			}}
		}
	},
	components : {action},

	data : function(){

		return {
			loading : false
		}

	},

	created : () => {

	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,

		actions : function(){
			return _.filter(this.event.actions, function(a){
				return !a.link || a.link.type != 'internalLink'
			})
		},

		menu : function(){
			return _.map(this.actions, (a) => {
				return {
					text : a.text,
					icon : a.icon,
					action : 'default'
				}
			})
		}
	}),

	methods : {
		menuaction : function(i){
			
		}
	},
}