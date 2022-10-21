<template>
<div class="template_menu">
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
	name: 'template_menu',
	props: {
		campaignTemplate: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		}
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){

			var menu = [{
					text : 'campaigns.menu.deletetemplate',
					icon : 'fas fa-trash',
					action : 'deletetemplate'
				}]

			if(this.campaignTemplate.Id){
				menu.push({
					text : 'campaigns.menu.clonecampaign',
					icon : 'fas fa-clone',
					action : 'clonecampaign'
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

		clonecampaign : function(){
			this.$router.push('/campaigns/template/new?clone=' + this.campaignTemplate.Id).catch(e => {})
		},

		deletetemplate : function(){

			//console.log('this.campaignTemplate', this.campaignTemplate)

			this.$dialog.confirm(
				this.$t('campaigns.labels.removeCampaignTemplate'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {

				console.log("REMOVE")

				this.core.campaigns.removeCampaignTemplate(this.campaignTemplate).then(r => {
					this.$emit('remove')
				}).catch(e => {
					console.error(e)
				})

			}).catch( e => {
				console.error(e)
            })

		}
	},
}
</script>
