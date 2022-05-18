import { mapState } from 'vuex';
export default {
	name: 'portfolio_client',
	props: {
		profile : Object,
		small : Boolean
	},


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
	}),

	methods : {
		
	},
}