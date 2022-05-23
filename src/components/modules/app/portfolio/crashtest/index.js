import { mapState } from 'vuex';

import chart from './chart/index.vue'
import ctdetails from './details/index.vue'

import summarybutton from '@/components/delements/summarybutton/index.vue'

export default {
	name: 'portfolios_crashtest',
	props: {
		portfolio : Object
	},

	components : {
		chart, 
		ctdetails,
		summarybutton
	},

	data : function(){

		return {
			loading : false,

			ct : {},

			valuemodes : [
				{
					icon : "fas fa-dollar-sign",
					id : 'd'
				},
				{
					icon : "fas fa-percent",
					id : 'p'
				}
			],

			summary : [

				{
					text : 'labels.crashrating',
					index : 'ocr'
				},
				{
					text : 'labels.tolerance',
					index : 'pcr'
				}
				
			]

		}

	},

	created : function(){
		this.get()
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		valuemode: state => state.valuemode,
	}),

	methods : {
		get : function(){

			this.loading = true

			this.core.pct.stressdetails(this.portfolio.id).then(R => {
				console.log("RR", r)
			})

			//this.core.pct.get().then(r => {

			this.core.pct.stresstest(this.portfolio.id).then(r => {


				this.ct = r

				return Promise.resolve(r)
			}).finally(() => {
				this.loading = false
			})
		},

		changevaluemode : function(v){
			this.$store.commit('valuemode', v)
		}
	},
}