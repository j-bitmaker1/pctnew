<template>
<div class="page">

	<topheader :back="mobileview ? '/' : ''">
		<template v-slot:info>
			<span>Campaigns</span>
		</template>
		<template v-slot:right>
			
			<div class="buttonpanel">
				<i class="fas fa-plus" @click="newcampaigns"></i>
			</div>
			
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<div class="linenavigation">
				<linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
			</div>

			<component :is="module"/>

		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import campaigns from '@/components/modules/campaigns/dashboard/index.vue';
import alltemplates from '@/components/modules/campaigns/alltemplates/index.vue';
import settings from '@/components/modules/campaigns/settings/index.vue';

import linenavigation from "@/components/assets/linenavigation/index.vue";
import { mapState } from 'vuex';
export default {
	name: 'campaigns_page',
	components: {
        campaigns, 
		linenavigation,
		alltemplates,
		settings
	},

	computed: {
		module : function(){
			return this.active
		},

		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},
		...mapState({
			mobileview : state => state.mobileview,
		})
	},

	data : function(){
		return {
			navigation : [
				{
					text : 'campaigns.labels.dashboard',
					id : 'campaigns',
					icon : "fas fa-list"
				},
				{
					text : 'campaigns.labels.templates',
					id : 'alltemplates',
					icon : "fas fa-adjust"
				},
				{
					text : 'campaigns.labels.settings',
					id : 'settings',
					icon : "fas fa-cogs"
				}
			],

			navkey : 'p',
			navdefault : 'campaigns'
		}
	},

	methods: {
		newcampaigns : function(){

			var items = []
				items.push({
					text: 'campaigns.labels.newCampaign',
					icon: 'fas fa-play',
					action: this.newCampaign
				})

				items.push({
					text: 'campaigns.labels.newCampaignTemplate',
					icon: 'fas fa-route',
					action: this.newCampaignTemplate
				})

				items.push({
					text: 'campaigns.labels.newEmailTemplate',
					icon: 'fas fa-envelope',
					action: this.newEmailTemplate
				})

			this.core.vueapi.listmenu(items)
		},
		newCampaignTemplate : function(){
			this.$router.push('/campaigns/template/new').catch(e => {})
		},
		newEmailTemplate : function(){
			this.$router.push('/campaigns/emailtemplate/new').catch(e => {})
		},
		newCampaign : function(){
			this.core.campaigns.start()
		}
	},

	mounted() {

	}
}
</script>
