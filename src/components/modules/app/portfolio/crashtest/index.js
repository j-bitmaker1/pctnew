import { mapState } from 'vuex';

import ctmenu from './menu/index.vue'
import ctmain from './main/index.vue'
import summarybutton from '@/components/delements/summarybutton/index.vue'

export default {
	name: 'portfolios_crashtest',
	props: {
		portfolio : Object,
		profile : Object
	},

	components : {
		ctmain,
		summarybutton,
		ctmenu
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

			summary : [

				{
					text : 'labels.crashrating',
					index : 'ocr'
				},
				{
					text : 'labels.tolerance',
					th : 'tolerance',

					click : () => {
						if (this.profile && this.profile.questionnaire)
							this.core.vueapi.questionnaireResult(this.profile.questionnaire)
						
					}
				}
				
			]

		}

	},

	created : function(){
		this.core.on('invalidate', this.name, (d) => {
			if(d.key == 'stress' && d.portfolio == this.portfolio.id){
				this.get()
			}
		})

		this.core.on('settingsUpdated', this.name, (type) => {
			if(type == 'stress'){
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
				tolerance : this.profile ? this.profile.tolerance : null
			}
		
		}
	}),


	methods : {
		get : function(){

			this.loading = true


			this.core.pct.stresstest(this.portfolio.id).then(r => {
				this.cts = this.core.pct.composeCTS({[this.portfolio.id] : r}, this.portfolio.total())

				this.ct = this.cts.cts[this.portfolio.id]

				return Promise.resolve(r)

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
			this.get()
		},

		scoreConverterChanged : function(){
			this.get()
		}
	},
}