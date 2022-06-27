<template>
<div class="page">

	<topheader back="back">
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
import linenavigation from "@/components/assets/linenavigation/index.vue";

export default {
	name: 'campaigns_page',
	components: {
        campaigns, templates,
		linenavigation
	},

	computed: {
		module : function(){
			return this.active
		},

		active : function(){
			return this.$route.query[this.navkey] || this.navdefault
		},
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
				}
			],

			navkey : 'p',
			navdefault : 'campaigns'
		}
	},

	methods: {
		newcampaigns : function(){

			var items = []

			if(this.active == 'campaigns'){
				items.push({
					text: 'campaigns.labels.newCampaign',
					icon: 'fas fa-plus',
					action: this.newCampaign
				})
			}

			if(this.active == 'templates'){
				items.push({
					text: 'campaigns.labels.newCampaignTemplate',
					icon: 'fas fa-plus',
					action: this.newCampaignTemplate
				})
			}

			this.core.vueapi.listmenu(items)
		},
		newCampaignTemplate : function(){
			console.log('newCampaignTemplate')
			this.$router.push('/campaigns/template/new')
		},
		newCampaign : function(){

		}
	},

	mounted() {

	}
}
</script>
