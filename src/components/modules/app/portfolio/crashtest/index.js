import { mapState } from 'vuex';

import ctmenu from './menu/index.vue'
import totalchart from './totalchart/index.vue';

export default {
	name: 'portfolios_crashtest',
	props: {
		portfolio : Object,
		profile : Object,
		height : Number
	},

	components : {
		ctmenu,
		totalchart
	},

	data : function(){

		return {
			loading : false,

			ct : {},
			cts : {},

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

			optimizedPortfolio : null

			

		}

	},

	created : function(){
		this.core.on('invalidate', this.name, (d) => {
			if(d.key == 'stress' && d.portfolio == this.portfolio.id){
				this.get()
			}
		})

		this.core.on('settingsUpdated', this.name, (type) => {

			if(type == 'STRESS'){
				this.get()
			}

		})

		this.get()
	},

	beforeDestroy(){
		this.core.off('invalidate', this.name)
		this.core.off('settingsUpdated', this.name)
	},

	watch: {
		portfolio : function(){
			this.get()
		},

		optimizedPortfolio : function(){
			this.get()
		}
		/*portfolio : {
			immediate : true,
			deep : true,
			handler : function(){
				this.get()
			}
		}*/
	},
	computed: mapState({
		auth : state => state.auth,
		valuemode: state => state.valuemode,
		th : function(){
			return {
				capacity : this.profile ? this.profile.capacity : null,
				tolerance : this.profile ? this.profile.tolerance : null
			}
		
		},

		cpmdata : function(){
			return [
			
				{
					text : this.$t('labels.tolerance'),
					index : 'tolerance',
					click : () => {
						if (this.profile && this.profile.questionnaire) this.core.vueapi.questionnaireResult(this.profile.questionnaire)
					},
					value : this.profile ? this.profile.tolerance : null
				},

				{
					index : 'capacity',
					text : this.$t('labels.capacity'),
					click : () => {
						if (this.profile && this.profile.questionnaire) this.core.vueapi.questionnaireResult(this.profile.questionnaire)
					},
					value : this.profile ? this.profile.capacity : null,
				}
				
			]
		},

		portfolios(){
			var result = {[this.portfolio.id] : this.portfolio}

			if(this.optimizedPortfolio){
				result[-1] = this.optimizedPortfolio
			}

			return result
		}
	}),


	methods : {
		get : function(){

			this.loading = true

			this.core.pct.stresstestskt([this.portfolio, this.optimizedPortfolio], this.valuemode, { fee : asset => {
				return this.portfolio.advisorFee || 0
			}}).then(cts => {

				this.cts = cts

				this.ct = this.cts.cts[this.portfolio.id]

				this.$emit('loaded', {
					ct : this.ct, 
					cts : this.cts
				})

				return Promise.resolve()

			}).catch(e => {
				console.error(e)
			}).finally(() => {
				this.loading = false
			})
		},

		changevaluemode : function(v){
			this.$store.commit('valuemode', v)
		},

		scenariosChanged : function(){
			//this.get()
		},

		scoreConverterChanged : function(){
			//this.get()
		},

		scenarioMouseOver : function(e){
			this.$emit('scenarioMouseOver', e)
		},

		optimized : function(optimizedPortfolio){
			this.optimizedPortfolio = optimizedPortfolio || null

			this.$emit('optimized', this.optimizedPortfolio)
		},

		cancelOptimization : function(){
			this.optimized(null)
		},

		saveOptimization : function(){

			this.core.vueapi.copyPortfolio(this.optimizedPortfolio, (portfolio) => {
				this.optimized(null)

				this.$dialog.confirm(
                	"Do you want to go to the new portfolio?", {
                    okText: "Yes",
                    cancelText : 'No'
                })
        
                .then((dialog) => {

					if(this.mobileview){
						this.$router.push('/portfolio/' + portfolio.id).catch(e => {})
					}
					else{
						this.$router.push('/summary?id=' + portfolio.id).catch(e => {})
					}

                }).catch( e => {
                    
                })

				
			})
			//this.editPortfolio
			
		}

	},
}