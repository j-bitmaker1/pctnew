import _ from 'underscore';
import { mapState } from 'vuex';
import contributor from '../contributor/index.vue'
import scenariosinfo from '@/components/modules/app/scenarios/info/index.vue'
import scenariosfactors from '@/components/modules/app/scenarios/factors/index.vue'


export default {
	name: 'portfolio_crashtest_scenariodetails',

	props: {
		portfolio: Object,
		scenario: Object
	},

	components: {
		contributor, scenariosinfo, scenariosfactors
	},

	data: function () {

		return {
			loading: false,
			info: null,
			dct: null
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
		//$route: 'getdata'
	},
	computed: mapState({
		auth: state => state.auth,
		positives: function () {
			return _.filter(this.contributors, (c) => {
				return c.value > 0
			}).length
		},
		negatives: function () {
			return _.filter(this.contributors, (c) => {
				return c.value < 0
			}).length
		},

		maxabs: function () {
			return Math.max(Math.abs(this.dct.profit), Math.abs(this.dct.loss))
		},

		contributors: function () {
			if (this.dct) {

				var cs = _.sortBy(this.dct.contributors[this.scenario.id], (c) => { return -Math.abs(c.value) })

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
			this.loading = true

			this.core.pct.stressdetails(this.portfolio.id).then(R => {

				this.dct = R
				return Promise.resolve(R)

			}).finally(() => {
				this.loading = false
			})

		},

		loadscenatioinfo: function () {
			this.core.pct.scenariosWithCustoms([this.scenario.id]).then(r => {
				this.info = r[0]

			})
		}
	},
}