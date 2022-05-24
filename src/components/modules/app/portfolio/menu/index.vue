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
					icon : 'fas fa-user-times', 
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

			this.core.vueapi.editPortfolio(this.portfolio, (portfolio) => {
				this.$emit('edit', portfolio)
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

			this.core.vueapi.selectClientToPortfolios([this.portfolio], (client) => {
				this.$emit('changeClient', client)
			})

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
