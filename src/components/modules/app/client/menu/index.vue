<template>
<div class="client_menu">
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
	name: 'client_menu',
	props: {
		profile: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		}
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){

			if(this.profile.Type == "CLIENT"){
				return [
					{
						text : 'labels.setportfoliostoclient',
						icon : 'fas fa-suitcase',
						action : 'setportfoliostoclient'
					},
					{
						text : 'labels.editclient',
						icon : 'fas fa-pen',
						action : 'editclient'
					},
					{
						text : 'labels.deleteclient',
						icon : 'fas fa-trash',
						action : 'deleteclient'
					}
				]
			}

			 if(this.profile.Type == "LEAD"){
				return [
					{
						text : 'labels.leadtocontact',
						icon : 'fas fa-user-friends',
						action : 'leadtocontact'
					},
					{
						text : 'labels.editlead',
						icon : 'fas fa-pen',
						action : 'editclient'
					},
					{
						text : 'labels.deletelead',
						icon : 'fas fa-trash',
						action : 'deleteclient'
					}
				]
			}
		}

	}),

	methods: {
		menuaction : function(action, item){
			if (this[action]){
				this[action]()
			}   
		},

		leadtocontact : function(){
			this.core.crm.leadtocontact(this.profile.ID, {
				preloader : true,
				showStatus : true
			}).then(r => {
				this.$emit('leadtocontact', this.profile)
			}).catch(e => {

			})
		},

		deleteclient : function(){

			this.core.crm.deletecontact(this.profile.ID, {
				preloader : true,
				showStatus : true
			}).then(r => {
				this.$emit('delete', this.profile)
			}).catch(e => {

			})
			
		},

		editclient : function(){

			this.$store.commit('OPEN_MODAL', {
				id : 'modal_client_edit',
				module : "client_edit",
				caption : "Edit client",

				data : {
					edit : this.profile
				},

				events : {
					success : (data) => {
						var profile = _.extend(this.profile, data)

						this.$emit('edit', profile)
					}
				}
			})
		},

		setportfoliostoclient : function(){
			this.$store.commit('OPEN_MODAL', {
				id : 'modal_portfolios_main',
				module : "portfolios_main",
				caption : "Select Portfolios For Client", /// TODO name

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

							this.$emit('portfoliosChanged', portfolios)

						})

					}
				}
			})
		}
	},
}
</script>
