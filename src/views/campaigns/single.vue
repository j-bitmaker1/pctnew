<template>
<div class="page">

	<topheader back="back">
		<template v-slot:info>
			<div class="header" v-if="!loading && campaign">
				<div class="name">
					{{campaign.RecipientName}}
				</div>

				<div class="template">
					{{campaign.RecipientEmail}}
				</div>

			</div>
		</template>
		<template v-slot:right>
			<campaignmenu v-if="!loading && campaign" :campaign="campaign"/>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<linepreloader v-if="loading"/>

			<campaignmain v-if="!loading && campaign" :campaign="campaign"/>

		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.name
	font-weight : 700
	font-size: 1.3em
.template
	font-size: 0.9em
	color : srgb(--color-txt-ac)

</style>

<script>

import campaignmain from '@/components/modules/campaigns/single/main/index.vue'
import campaignmenu from '@/components/modules/campaigns/single/menu/index.vue'

export default {
	name: 'campaign_page',
	components: {
        campaignmain,
		campaignmenu,
	},

	data : function(){
		return {
			campaign : null,
			loading : true,
		}
	},

	computed: {
        id : function(){
            return this.$route.params.id
        }
	},

	methods: {
        load : function(){

			this.loading = true

            this.core.api.campaigns.single.get(this.id).then(r => {
				console.log("R", r)
				this.campaign = r
			}).finally(() => {
				this.loading = false
			})
        }
	},

	created(){
		this.load()
	},

	mounted() {
		
	}
}
</script>
