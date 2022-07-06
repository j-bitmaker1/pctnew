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
					text : 'labels.portfoliopdf',
					icon : 'fas fa-file-pdf',
					action : 'portfoliopdf',

            		features : ['PCT']
				},
				{
					text : 'menu.compare',
					icon : 'fas fa-list-ul',
					action : 'compare',

            		features : ['PCT']
				},
				{
					text : 'labels.editportfolio',
					icon : 'fas fa-pen',
					action : 'edit',

            		features : ['PCT']
				},
				{
					text : 'labels.moveportfoliotofolder',
					icon : 'fas fa-folder',
					action : 'moveportfoliotofolder'
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
					action : 'linkToClient',

					features : ["CRM"]
				})
			}  
			else{
				menu.unshift({
					text : 'labels.changeClient',
					icon : 'fas fa-user-edit',
					action : 'changeClient',

					features : ["CRM"]
				})

				menu.unshift({
					text : 'labels.unlinkClient',
					icon : 'fas fa-user-edit',
					action : 'unlinkClient',

					features : ["CRM"]
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


			return this.core.user.extendByFeaturesMenu(menu)
		
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

		portfoliopdf: function(){

			this.core.vueapi.portfoliopdf({id : this.portfolio.id}, (pdf) => {
			})

		},

		delete : function(){

			this.$dialog.confirm(
				"Do you really want to delete this portfolio?", {
				okText: vm.$t('yes'),
				cancelText : vm.$t('no')
			})
	
			.then((dialog) => {

				this.core.api.pctapi.portfolios.delete(this.portfolio.id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					
					this.$emit('delete', this.portfolio)
				})

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
		},

		compare : function(){
			this.$router.push('/compare?ids=' + this.portfolio.id)
		},

		moveportfoliotofolder : function(){
			this.core.vueapi.selectFolder((folder) => {

				return this.$dialog.confirm(
					'Do you really want to move '+this.portfolio.name+' to '+folder.name+'?', {
					okText: 'Yes',
					cancelText : 'No'
				})
		
				.then((dialog) => {

					this.$store.commit('globalpreloader', true)

					var fsportfolios = [this.core.filesystem.portfolioToFsObject(this.portfolio)]
					
					return this.core.filesystem.move(fsportfolios, folder).then(r => {
						this.$emit('gotofolder', folder)
					}).catch(e => {

						this.$store.commit('icon', {
							icon: 'error',
							message: e.error
						})

					}).finally(() => {
						this.$store.commit('globalpreloader', false)
					})

				}).catch( e => {
					
				})
			})
			
		}

		
	},
}
</script>
