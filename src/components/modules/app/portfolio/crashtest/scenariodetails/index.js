import _ from 'underscore';
import { mapState } from 'vuex';
import contributor from '../contributor/index.vue'
import scenarioninfo from '../scenarioinfo/index.vue'

export default {
	name: 'portfolio_crashtest_scenariodetails',

	props: {
		portfolio : Object,
		scenario : Object,
		ct : Object
	},

	components : {
		contributor, scenarioninfo
	},

	data : function(){

		return {
			loading : false,
			info : null,
			dct : null
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
				return c.value > 0
			}).length
		},
		negatives : function(){
			return _.filter(this.contributors, (c) => {
				return c.value < 0
			}).length
		},

		maxabs : function(){
			return Math.max(Math.abs(this.ct.profit), Math.abs(this.ct.loss))
		},

		contributors : function(){
			if(this.dct){

				var cs = _.sortBy(this.dct.contributors[this.scenario.id], (c)=>{return -Math.abs(c.value)})
				
				return _.map(cs, (c) => {
					return {
						value : c.value,
						asset : _.find(this.portfolio.positions, (ps) => {
							return ps.ticker == c.ticker
						}) || {}
					}
				})
			}

			return []
		}
	}),

	methods : {
		loadcontributors : function(){
			this.loading = true

			this.core.pct.stressdetails(this.portfolio.id).then(R => {
				this.dct = R

				return Promise.resolve(R)
			}).finally(() => {
				this.loading = false
			})

			/*this.core.pct.getcontributors(this.scenario.id).then(r => {

				this.contributors = _.sortBy(r, (c)=>{return c.value})

				return Promise.resolve(r)
			}).finally(() => {
				this.loading = false
			})*/

		},

		loadscenatioinfo : function(){
			this.core.pct.scenarios([this.scenario.id]).then(r => {
				this.info = r[0]
			})
		}
	},
}