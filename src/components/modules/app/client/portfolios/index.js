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
					reversed : true
				},
				{
					text : 'labels.tolerance',
					index : 'tolerance',
					reversed : true
				},
				{
					text : 'labels.capacity',
					index : 'capacity'
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

			console.log('this.profile', this.profile)

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
			this.$router.push('/portfolio/' + portfolio.id)
		}
	},
}