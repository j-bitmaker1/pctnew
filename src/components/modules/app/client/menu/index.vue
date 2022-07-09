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
						text : 'labels.sharequestionnaire',
						icon : 'fas fa-link',
						action : 'sharequestionnaire'
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
						text : 'labels.sharequestionnaire',
						icon : 'fas fa-link',
						action : 'sharequestionnaire'
					},

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

			this.$dialog.confirm(
				"Do you really want to delete this contact?", {
				okText: vm.$t('yes'),
				cancelText : vm.$t('no')
			})
	
			.then((dialog) => {

				this.core.crm.deletecontact(this.profile.ID, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('delete', this.profile)
				}).catch(e => {

				})

			}).catch((e) => {

			})
			
			
		},

		editclient : function(){

			this.core.vueapi.editClient(this.profile, (profile) => {
				this.$emit('edit', profile)
			})
			
		},

		sharequestionnaire : function(){
			this.core.api.crm.questionnaire.getlink(this.profile.ID).then(url => {

				this.$store.commit('OPEN_MODAL', {
					id: 'modal_share',
					module: "share",
					caption: "Share Questionnaire",
					mclass : 'small',
					data : {
						url
					}
				})

			}).catch(e => {
				
				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

			})
		},

		setportfoliostoclient : function(){

			this.core.vueapi.selectPortfoliosToClient(this.profile, (portfolios) => {
				this.$emit('portfoliosChanged', portfolios)
			})

		}
	},
}
</script>
