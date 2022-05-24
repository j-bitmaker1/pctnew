import { mapState } from 'vuex';
import contributor from '../contributor/index.vue'
import scenarioninfo from '../scenarioinfo/index.vue'

export default {
	name: 'portfolio_crashtest_scenariodetails',

	props: {
		scenario : Object,
		ct : Object
	},

	components : {
		contributor, scenarioninfo
	},

	data : function(){

		return {
			loading : false,
			contributors : [],
			info : null
		}

	},

	created : function(){
		this.loadcontributors()
		this.loadscenatioinfo()

	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		positives : function(){
			return _.filter(this.contributors, (c) => {
				return c.value >= 0
			}).length
		},
		negatives : function(){
			return _.filter(this.contributors, (c) => {
				return c.value < 0
			}).length
		},

		maxabs : function(){
			return Math.max(Math.abs(this.ct.profit), Math.abs(this.ct.loss))
		}
	}),

	methods : {
		loadcontributors : function(){
			this.loading = true

			this.core.pct.getcontributors(this.scenario.id).then(r => {

				this.contributors = _.sortBy(r, (c)=>{return c.value})

				return Promise.resolve(r)
			}).finally(() => {
				this.loading = false
			})

		},

		loadscenatioinfo : function(){
			this.core.pct.scenarios([this.scenario.id]).then(r => {
				this.info = r[0]
			})
		}
	},
}