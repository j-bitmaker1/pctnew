<template>
<div class="campaign_menu">
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
	name: 'campaign_menu',
	props: {
		campaign: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		}
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){
			var m = []

			if(this.campaign.Status != 'DELETED'){
				m.unshift({
					text : 'campaigns.menu.deletecampaign',
					icon : 'fas fa-trash',
					action : 'deletecampaign',
					class : 'bad'
				})
			}

			if (this.campaign.Status != 'CANCELLED' && this.campaign.Status != 'COMPLETED' && this.campaign.Status != 'DELETED'){
				m.unshift({
					text : 'campaigns.menu.cancelcampaign',
					icon : 'fas fa-stop',
					action : 'cancelcampaign',
				})
			}

			if(this.campaign.Status == 'PROCESS'){
				m.unshift({
					text : 'campaigns.menu.pausecampaign',
					icon : 'fas fa-pause',
					action : 'pausecampaign',
				})
			}

			if(this.campaign.Status == 'PROCESSPAUSED'){
				m.unshift({
					text : 'campaigns.menu.resumecampaign',
					icon : 'fas fa-play',
					action : 'resumecampaign',
					class : 'good'
				})
			}

			if (this.campaign.RecipientId){
				m.unshift({
					text : 'campaigns.menu.gotocontact',
					icon : 'fas fa-user',
					action : 'gotocontact'
				})
			}

			return m
		}

	}),

	methods: {
		menuaction : function(action, item){
			if (this[action]){
				this[action]()
			}   
		},

		deletecampaign : function(){
			this.$dialog.confirm(
				this.$t('campaigns.dialog.deletecampaign'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {
				this.core.api.campaigns.single.delete(this.campaign.Id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('deletesignle')
				})
			})
			
		},
		cancelcampaign : function(){

			this.$dialog.confirm(
				this.$t('campaigns.dialog.cancelcampaign'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {
				this.core.api.campaigns.single.cancel(this.campaign.Id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('cancelsignle')
				})
			})

			
		},
		pausecampaign : function(){

			this.$dialog.confirm(
				this.$t('campaigns.dialog.pausecampaign'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {
				this.core.api.campaigns.single.pause(this.campaign.Id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('pausesignle')
				})
			})

		},
		resumecampaign : function(){

			this.$dialog.confirm(
				this.$t('campaigns.dialog.resumecampaign'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {
				this.core.api.campaigns.single.resume(this.campaign.Id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('resumesignle')
				})
			})

			
		},

		gotocontact : function(){
			this.core.api.crm.contacts.get(this.campaign.RecipientId, {
				preloader : true
			}).then(profile => {


				if(profile.Type == "LEAD"){
					this.$router.push('/lead/' + profile.ID)
				}

				if(profile.Type == "CLIENT"){
					this.$router.push('/client/' + profile.ID)
				}
			})
		}
	},
}
</script>
