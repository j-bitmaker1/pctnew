import _ from 'underscore';
import { mapState } from 'vuex';

import factor from '../custom/factor/index.vue'

export default {
	name: 'scenarios_custom2',

	props: {
		portfolio : Object,
		lastFactors : Object
	},

	components : {
		factor
	},

	data : function(){

		return {
			loading : false,
			dct : null,
			factors : {},
			dctloading : false
		}

	},

	created : function(){

		if (this.lastFactors){
			this.initEditing()
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

		hasfactors : function(){
			return !_.isEmpty(this.factors)
		},

		canload : function(){
			return _.filter(this.factors, (f) => {
				return f.value != 0
			}).length > 0 && this.portfolio
		},

		canloadStrong : function(){
			return _.filter(this.factors, (f) => {
				return f.value != 0
			}).length > 0
		}
	}),

	methods : {

		initEditing : function(){

			this.core.api.pctapi.stress.factors(null, {
				preloader : true,
				showStatusFailed : true
			}).then(r => {

				var iff = _.filter(_.map(this.lastFactors, (f) => {

					var donor = _.find(r, (fa) => {
						return fa.name == f.name
					})

					if(donor){
						return {
							...f,
							...donor,
							
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


		cancel : function(){
			this.$emit('cancel')
			this.close()
		},

		close : function(){
			this.$emit('close')
		},

		savescenario : function(){
			if(!this.canloadStrong) return

			this.core.vueapi.savecustomscenario({
				factors : this.factors
			}, ({
				result,
				edited
			}) => {
				this.$emit('customscenariosaved', result)
			})
		},

		

		changed : function(factor, value){
			this.$set(factor, 'value', value)
		},

		addfactor : function(){

			this.$store.commit('select', {
				context : 'factors',
				items : this.factors
			})

			this.core.vueapi.selectfactors({
			}, {
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

			this.$emit('factors', this.factors)

			if (this.canload){

				this.dctloading = true

				this.core.pct.customstresstest({

					portfolio : this.portfolio,
					factors : this.factors

				}).then(r => {


					this.dct = r

					this.$emit('loaded', this.dct)
				}).finally(() => {
					this.dctloading = false
				})
				
			}

		},

	
	},
}