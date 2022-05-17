import { mapState } from 'vuex';

import portfoliolist from '@/components/modules/app/portfolios/list/index.vue'

export default {
	name: 'client_portfolios',
	props: {
		profile : Object
	},

	components : {
		portfoliolist, 
	},

	data : function(){

		return {
			loading : false
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
		}
	}),

	methods : {
		create : function(){
			this.$store.commit('OPEN_MODAL', {
				id : 'modal_portfolios_edit',
				module : "portfolio_edit",
				caption : "New Portfolio For Client",

				data : {
					payload : {}
				}
			})
		},

		select : function(){

			this.$store.commit('OPEN_MODAL', {
				id : 'modal_portfolios_main',
				module : "portfolios_main",
				caption : "Select Portfolios For Client",

				data : {
					
					select : {
						multiple : true
					}
				},

				events : {
					selected : (portfolios) => {

						this.core.pct.setPortfoliosToClient(this.profile.ID, portfolios, {
							preloader : true,
							showStatus : true
						}).then(r => {

							if (this.$refs['list'])
								this.$refs['list'].reload()

							///// clientChanged
						})

					}
				}
			})
			
		}
	},
}