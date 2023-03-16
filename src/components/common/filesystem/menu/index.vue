<template>
<div class="filesystem_menu">
	<tooltip>
		<template v-slot:item>
			<div>
				<slot name="default"/>
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
	name: 'filesystem_menu',
	props: {
		currentroot: Object,
	
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){

			var menu = []

			if(!this.currentroot.attributes.readonly) { 

				menu.push({
					text : 'labels.moveportfoliostofolder',
					icon : 'fas fa-suitcase',
					action : 'moveportfoliostofolder'
				})

			}

			if(!this.currentroot.attributes.nonremovable) { 

				menu.push({
					text : 'labels.remove',
					icon : 'fas fa-times',
					action : 'removeportfolio'
				})

			}

			console.log('currentroot', this.currentroot)

			return menu
			
		}

	}),

	methods: {

		menuaction : function(action, item){
			if (this[action]){
				this[action](item)
			}   
		},

		removeportfolio : function(item){

			this.$store.commit('globalpreloader', true)

			return this.core.api.filesystem.delete['folder']({
				id : this.currentroot.id
			}).then(() => {
				this.$store.commit('icon', {
					icon: 'success'
				})

				this.$emit('removed')
			}).catch(e => {
				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})
			}).finally(() => {
				this.$store.commit('globalpreloader', false)
			})
		},

		moveportfoliostofolder : function(){
			this.core.vueapi.selectPortfolios((portfolios) => {

				return this.$dialog.confirm(
					'Do you really want to move '+portfolios.length+' portfolio(s) to '+this.currentroot.name+'?', {
					okText: 'Yes',
					cancelText : 'No'
				})
		
				.then((dialog) => {

					this.$store.commit('globalpreloader', true)

					var fsportfolios = _.map(portfolios, (portfolio) => {
						return this.core.filesystem.portfolioToFsObject(portfolio)
					})
					
					return this.core.filesystem.move(fsportfolios, this.currentroot).then(r => {

						this.$emit('reload')
						
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
				
			}, {
				caption : "Select portfolios"
			})
		}
	},
}
</script>
