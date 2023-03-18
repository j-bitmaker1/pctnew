import _ from 'underscore';
import { mapState } from 'vuex';
import contributor from '../contributor/index.vue'
import scenariosinfo from '@/components/modules/app/scenarios/info/index.vue'
import scenariosfactors from '@/components/modules/app/scenarios/factors/index.vue'


export default {
	name: 'portfolio_crashtest_scenariodetails',

	props: {
		portfolio: Object,
		scenario: Object,
		ct : Object,
		lossgain : Boolean,

		dcti : Object,
		infoi : Object
	},

	components: {
		contributor, scenariosinfo, scenariosfactors
	},

	data: function () {

		return {
			loading: false,
			info: null,
			dct: null,
			filter : null,
			lg : ['gain', 'loss']
		}

	},

	created: function () {

		this.loadcontributors()
		this.loadscenatioinfo()

		this.core.on('invalidate', this.name, (d) => {

			if (d.key == 'stress' && d.portfolio == this.portfolio.id) {
				this.loadcontributors()
				this.loadscenatioinfo()
			}
		})
	},

	beforeDestroy() {
		this.core.off('invalidate', this.name)
	},

	watch: {
		dcti : function(){
			this.dct = this.dcti
		},
		infoi: function(){
			this.info = this.infoi
		},
		//$route: 'getdata'
	},
	computed: mapState({
		auth: state => state.auth,
		positives: function () {
			return _.filter(this.contributors, (c) => {
				return c.value > 0 + 0.001
			}).length
		},
		negatives: function () {
			return _.filter(this.contributors, (c) => {
				return c.value < 0 - 0.001
			}).length
		},

		maxabs: function () {
			return Math.max(Math.abs(this.dct.profit), Math.abs(this.dct.loss))
		},

		filtered : function(){
			if(this.filter){
				return _.filter(this.contributors, (c) => {
					if(this.filter == 'positive' && c.value <= 0) return false
					if(this.filter == 'negative' && c.value >= 0) return false
					if(this.filter == 'reversed' && ((this.scenario.loss > 0 && c.value >= 0) || (this.scenario.loss < 0 && c.value <= 0))) return false

					return true
				})
			}

			return this.contributors
		},

		gain : function(){
			return _.filter(this.contributors, (c) => {
				return c.value > 0
			})
		},

		loss : function(){
			return _.filter(this.contributors, (c) => {
				return c.value < 0
			})
		},

		lgs : function(){
			return {
				loss : this.loss,
				gain : this.gain
			}
		},

		lgssum : function(){
			return {
				loss : _.reduce(this.loss, (m , c) => {return m + c.value}, 0),
				gain : _.reduce(this.gain, (m , c) => {return m + c.value}, 0),
			}
		},

		contributors: function () {
			if (this.dct) {

				var total = this.portfolio.total() + this.portfolio.uncovered()

				var cs = _.sortBy(this.dct.contributors[this.scenario.id], (c) => { 

					var asset = _.find(this.portfolio.positions, (ps) => {
						return ps.ticker == c.ticker
					}) || {}

					return -Math.abs(c.value / ((asset.value || 0) / this.lossgain ? 1 : total) )
				})

				

				return _.map(cs, (c) => {
					return {
						value: c.value,
						asset: _.find(this.portfolio.positions, (ps) => {
							return ps.ticker == c.ticker
						}) || {}
					}
				})
			}

			return []
		}
	}),



	methods: {
		loadcontributors: function () {

			if (this.dcti) {
				this.dct = this.dcti
				return
			}

			this.loading = true

			this.core.pct.stressdetails(this.portfolio, {
				term : this.ct ? this.ct.term : null
			}).then(R => {

				console.log("R", R)

				this.dct = R
				return Promise.resolve(R)

			}).finally(() => {
				this.loading = false
			})

		},

		loadscenatioinfo: function () {

			if (this.infoi){
				this.info = this.infoi
				return
			}

			this.core.pct.scenariosWithCustoms([this.scenario.id]).then(r => {
				this.info = r[0]

			})
		},

		setfilter : function(filter){
			if(this.filter == filter || !filter) this.filter = null
			
			else this.filter = filter
		}
	},
}