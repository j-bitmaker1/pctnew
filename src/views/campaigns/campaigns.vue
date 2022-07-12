<template>
<div class="page">

	<topheader :back="mobileview ? 'back' : ''">
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
.linenavigation
	margin-bottom: 3 * $r
</style>

<script>

import campaigns from '@/components/modules/campaigns/dashboard/index.vue';
import templates from '@/components/modules/campaigns/templates/index.vue';
import emails from '@/components/modules/campaigns/emails/index.vue';
import linenavigation from "@/components/assets/linenavigation/index.vue";
import { mapState } from 'vuex';
export default {
	name: 'campaigns_page',
	components: {
        campaigns, templates,
		linenavigation, emails
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
					id : 'campaigns'
				},
				{
					text : 'campaigns.labels.templates',
					id : 'templates'
				},
				{
					text : 'campaigns.labels.emailtemplates',
					id : 'emails'
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
