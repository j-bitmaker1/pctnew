import { mapState } from 'vuex';

import portfoliolist from '@/components/modules/app/portfolios/list/index.vue'
import summarybutton from '@/components/delements/summarybutton/index.vue'

export default {
	name: 'client_portfolios',
	props: {
		profile : Object
	},

	components : {
		portfoliolist, summarybutton
	},

	data : function(){

		return {
			loading : false,
			summary : [

				{
					text : 'labels.crashrating',
					index : 'riskscore',
					reversed : true,
					c : (v) => {
						return this.core.pct.ocr(v)
					}
				},
				{
					text : 'labels.tolerance',
					index : 'tolerance',
					reversed : true,
					c : (v) => {
						return this.core.pct.ocr(v)
					},

					click : () => {
						if (this.profile.questionnaire)
							this.core.vueapi.questionnaireResult(this.profile.questionnaire)
						
					}
				},
				{
					text : 'labels.capacity',
					index : 'capacity',
					c : function(v){return v},

					click : () => {
						if (this.profile.questionnaire)
							this.core.vueapi.questionnaireResult(this.profile.questionnaire)
						
					}
				}
				
			]
		}

	},

	created : () => {

	},


	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,

		payload : function(){

			return {
				crmContactIdFilter : this.profile.ID
			}
		},

		
	}),

	methods : {
		create : function(){
			this.$store.commit('OPEN_MODAL', {
				id : 'modal_portfolios_edit',
				module : "portfolio_edit",
				caption : "New Portfolio For Client",

				data : {
					payload : {
						crmContactId : this.profile.ID
					}
				},

				events : {
					edit : () => {
						this.reload()
					}
				}
			})
		},

		reload : function(){

			if (this.$refs['list'])
				this.$refs['list'].reload()
		},

		select : function(){

			this.core.vueapi.selectPortfoliosToClient(this.profile, () => {
				this.reload()
			})

		},

		open : function(portfolio){
			this.$router.push('/portfolio/' + portfolio.id).catch(e => {})

			this.$emit('close')
		}
	},
}