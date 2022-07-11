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
			var menu = [

				{
					text : 'campaigns.menu.deletesingle',
					icon : 'fas fa-trash',
					action : 'deletesingle'
				}
			]

			if (this.campaign.RecipientId){
				menu.unshift({
					text : 'campaigns.menu.gotocontact',
					icon : 'fas fa-user',
					action : 'gotocontact'
				})
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

		deletesingle : function(){

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
