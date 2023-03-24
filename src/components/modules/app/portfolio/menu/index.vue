<template>
<div class="portfolio_menu">
	<tooltip :ext="ext">
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
		},

		ext : Boolean
	},
	computed: mapState({
		auth: state => state.auth,
		mobileview : state => state.mobileview,
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
					text : 'menu.comparewith',
					icon : 'fas fa-list-ol',
					action : 'comparewith',

            		features : ['PCT']
				},

				

				/*{
					text : 'labels.optimizationSettings',
					icon : 'fas fa-cogs', 
					action : 'optimizationSettings',

            		features : ['PCT']
				},*/

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
				},

				{
					text : 'labels.exportXLSX',
					icon : 'far fa-file-excel',
					action : 'exportXLS'
				}
			]

			/*if(!this.mobileview){
				menu.unshift({
					text : 'labels.summary',
					icon : 'far fa-compass',
					action : 'portfolioSummary',
            		features : ['PCT']
				},)
			}*/

			if(!this.portfolio.crmContactId){

				menu.push({
					text : 'labels.setportfoliotolead',
					icon : 'fas fa-user-clock', 
					action : 'linkToLead',

					features : ["CRM"]
				})
				
				menu.push({
					text : 'labels.setportfoliotoclient',
					icon : 'fas fa-user-plus', 
					action : 'linkToClient',

					features : ["CRM"]
				})

				

				
			}  
			else{
				menu.push({
					text : 'labels.changeClient',
					icon : 'fas fa-user-edit',
					action : 'changeClient',

					features : ["CRM"]
				})

				menu.push({
					text : 'labels.unlinkClient',
					icon : 'fas fa-user-times',
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

		portfolioSummary: function(){


			this.$router.push('/summary?id=' + this.portfolio.id)

			//this.core.vueapi.portfolioSummary({portfolioId : this.portfolio.id}, {})

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
				okText: this.$t('yes'),
				cancelText : this.$t('no')
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

		linkToLead : function(){

			this.core.vueapi.selectLeadToPortfolios([this.portfolio], (client) => {
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

		exportXLS : function(){
			this.portfolio.exportXLS(true)
		},

		changeClient : function(){
			this.linkToClient()
		},

		compare : function(){
			this.$router.push('/compare?ids=' + this.portfolio.id).catch(e => {})
		},
		comparewith : function(){
			this.$router.push('/comparewith?p=' + this.portfolio.id).catch(e => {})
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
			
		},

		optimizationSettings : function(){
            this.core.vueapi.optimizationSettings({portfolio : this.portfolio}, () => {

			})
		}

		
	},
}
</script>
