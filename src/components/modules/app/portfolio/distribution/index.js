import { mapState } from 'vuex';


import _ from 'underscore';
import distributionMain from './main/index.vue'

import { Distribution } from '@/application/charts/index';

var distribution = new Distribution()

export default {
	name: 'distribution',
	props: {
		portfolio : Object
	},

	components : {
		distributionMain
	},

	data : function(){

		return {
			loading : false,

			periods : distribution.periods(),
			stds : distribution.stds(),

			period : 1,
			current_std :2
		}

	},

	created : function(){
	},

	watch: {
		
	},
	computed: mapState({
		auth : state => state.auth,
	}),

	methods : {

		changeperiod : function(e){
			this.period = Number(e.target.value)
		},

		changestd : function(e){
			this.current_std = Number(e.target.value)
		}
	},
}