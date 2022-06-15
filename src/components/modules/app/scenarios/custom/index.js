import _ from 'underscore';
import { mapState } from 'vuex';

import contributor from '@/components/modules/app/portfolio/crashtest/contributor/index.vue'

import factor from './factor/index.vue'
import portfolioPreview from '@/components/modules/app/portfolios/portfolio/index.vue'

export default {
	name: 'scenarios_custom',

	props: {
		initial : Object,
		edit : Object,

		mode : {
			type : String,
			default : 'customscenario'
		}
	},

	components : {
		factor, portfolioPreview,
		
		contributor
	},

	data : function(){

		return {
			loading : false,
			info : null,
			dct : null,

			portfolio : null,

			factors : {},
			name : "",
			description : "",

			scenarioId : 1,

			fields : [{
                id : 'name',
                text : 'fields.customScenarioName',
                rules : [{
                    rule : 'required'
                }]
            },{
                id : 'description',
                text : 'fields.customScenarioDescription',
				input : 'textarea',
                rules : [{
                    rule : 'required'
                }]
            }],
			tosavemode : false,
			dctloading : false
		}

	},

	created : function(){
		if (this.edit){

			this.initEditing()
			
		}

		if (this.initial){
			this.portfolio = this.initial
		}
	},

	beforeDestroy(){
		
	},

	watch: {
		factors : {
			deep : true,
			handler : function(){
				this.load()
			}
		},

		portfolio : function(){
			this.load()
		}
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
			return Math.max(Math.abs(this.dct.profit), Math.abs(this.dct.loss))
		},

		contributors : function(){
			if(this.dct){

				var cs = _.sortBy(this.dct.contributors[this.scenarioId], (c)=>{return -Math.abs(c.value)})
				
				return _.map(cs, (c) => {
					return {
						value : c.value,
						asset : _.find(this.portfolio.positions, (ps) => {
							return ps.ticker == c.ticker
						}) || {}
					}
				})
			}

			return null
		},

		hasfactors : function(){
			return !_.isEmpty(this.factors)
		},

		canload : function(){
			return _.filter(this.factors, (f) => {
				return true///f.value != 0
			}).length > 0 && this.portfolio
		},

		canloadStrong : function(){
			return _.filter(this.factors, (f) => {
				return f.value != 0
			}).length > 0 && this.portfolio
		}
	}),

	methods : {

		initEditing : function(){

			this.name = this.edit.name
			this.description = this.edit.description

			this.core.api.pctapi.stress.factors(null, {
				preloader : true,
				showStatusFailed : true
			}).then(r => {

				var iff = _.filter(_.map(this.edit.factors, (f) => {

					var donor = _.find(r, (fa) => {
						return fa.name == f.name
					})

					if(donor){
						return {
							...donor,
							...f,
						}
					}

					return null

				}), (f) => {return f})

				var factors = {}

				_.each(iff, (f) => {
					factors[f.id] = f
				})

				this.factors = factors
                
            })
			

		},

		changeInfo : function(v){
			this.name = v.name
			this.description = v.description
		},

		cancel : function(){
			this.$emit('cancel')
			this.close()
		},

		close : function(){
			this.$emit('close')
		},

		save : function(){

			if(!this.canloadStrong) return

			if(!this.name || !this.description){

				this.$store.commit('icon', {
					icon: 'error',
					message: "Please fill name and description of custom scenario"
				})

				setTimeout(() => {
					if (this.$refs.form)
						this.$refs.form.focusOnIntput()
				}, 2050)

				return 
			}

			var scenario = {
				name : this.name, 
				description : this.description,
				factors : _.map(this.factors, (f) => {
					return {
						name : f.name,
						value : f.value
					}
				})
			}

			var promise = null

			if(this.edit){

				scenario.id = this.edit.id

				promise = this.core.api.pctapi.customscenarios.update(scenario, {
					preloader : true,
					showStatus : true
				})

			}
			else{

				promise = this.core.api.pctapi.customscenarios.add(scenario, {
					preloader : true,
					showStatus : true
				})

			}

			promise.then(r => {
				this.$emit('success', r)
				this.close()
			})

			//
		},

		changed : function(factor, value){
			this.$set(factor, 'value', value)
		},

		selectPortfolio : function(){
			
			this.core.vueapi.selectPortfolios((portfolios) => {
				this.portfolio = portfolios[0]
			}, {
				one : true
			})
		},

		addfactor : function(){

			if(!_.isEmpty(this.factors))
				this.$store.commit('select', {
					context : 'factors',
					items : this.factors
				})

			this.core.vueapi.selectfactors({}, {
				selected : (factors) => {

					var cf = {}


					_.each(factors, (f, i) => {
						cf[i] = {
							...f,
							value : this.factors[i] ? (this.factors[i].value || 0) : 0
						}
					})

					this.factors = cf

				},

				close : () => {
					this.$store.commit('unselect', {
                        context : 'factors'
                    })
				}
			})
		},

		load : function(){

			if(this.canload){

				this.dctloading = true

				this.core.pct.customstresstest({
					portfolio : this.portfolio,
					factors : this.factors
				}).then(r => {
					this.dct = r
				}).finally(() => {
					this.dctloading = false
				})
				
			}

		},

		changemodetosave : function(){
			this.tosavemode = true

			setTimeout(() => {
				if (this.$refs.form)
					this.$refs.form.focusOnIntput()
			}, 50)
		}
	},
}