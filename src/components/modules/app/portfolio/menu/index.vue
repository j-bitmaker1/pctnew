<template>
<div class="portfolio_menu">
	<tooltip>
		<template v-slot:item>
			<div :class="buttonclass">
				<i class="fas fa-ellipsis-v"></i>
			</div>
		</template>

		<template v-slot:content="i">
			<listmenu :items="menu" @action="menuaction" :close="i.close"/>
		</template>

	</tooltip>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'portfolio_menu',
	props: {
		portfolio: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		}
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){

			var menu = [
				
				{
					text : 'labels.editportfolio',
					icon : 'fas fa-pen',
					action : 'edit'
				},
				{
					text : 'labels.deleteportfolio',
					icon : 'fas fa-trash',
					action : 'delete'
				}
			]

			if(!this.portfolio.crmContactId){
				menu.unshift({
					text : 'labels.setportfoliotoclient',
					icon : 'fas fa-user-check',
					action : 'linkToClient'
				})
			}  
			else{
				menu.unshift({
					text : 'labels.changeClient',
					icon : 'fas fa-user-edit',
					action : 'changeClient'
				})

				menu.unshift({
					text : 'labels.unlinkClient',
					icon : 'fas fa-user-edit',
					action : 'unlinkClient'
				})
				
			} 

			if(this.portfolio.status == 'DELETED'){
				menu = [
					{
						text : 'labels.recoverportfolio',
						icon : 'fas fa-undo',
						action : 'recover'
					}
				]
			}

			return menu
		
		}

	}),

	methods: {
		menuaction : function(action, item){
			if (this[action]){
				this[action]()
			}   
		},

		edit : function(){
			
			this.$store.commit('OPEN_MODAL', {
				id : 'modal_portfolio_edit',
				module : "portfolio_edit",
				caption : "Edit Portfolio",
				data : {
					edit : {
						name : this.portfolio.name,
						assets : this.portfolio.positions,
						id : this.portfolio.id
					}
				},

				events : {
					edit : (portfolio) => {

						

						this.$emit('edit', portfolio)
					}
				}
			})

		},

		delete : function(){
			

			this.core.api.pctapi.portfolios.delete(this.portfolio.id, {
				preloader : true,
				showStatus : true
			}).then(r => {
				
				this.$emit('delete', this.portfolio)
			})
		},

		recover: function(){
			

			this.core.api.pctapi.portfolios.recover(this.portfolio.id, {
				preloader : true,
				showStatus : true
			}).then(r => {
				this.$emit('recover', this.portfolio)
			})
		},

		linkToClient : function(){

			this.$store.commit('OPEN_MODAL', {
				id : 'modal_clients',
				module : "clients",
				caption : "Select Client",
				data : {
					select : {
						multiple : false
					}
				},

				events : {
					selected : (clients) =>{

						var client = clients[0]

						this.core.pct.setPortfoliosToClient(client.ID, [this.portfolio], {
							preloader : true,
							showStatus : true
						}).then(r => {
							this.$emit('changeClient', client)
						})
					}
				}
			})

			//this.$emit('linkedToClient', this.portfolio)
		},

		unlinkClient : function(){

			this.core.pct.setPortfoliosToClient(0, [this.portfolio], {
				preloader : true,
				showStatus : true
			}).then(r => {
				this.$emit('changeClient', null)
			})
			
		},

		changeClient : function(){
			this.linkToClient()
		}

		
	},
}
</script>
