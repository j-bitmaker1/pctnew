<template>
<div class="page">

	<topheader back="back">
		<template v-slot:info>
			<div class="header" v-if="!loading && campaignTemplate">
				<div class="name">
					{{campaignTemplate.Name || "Create new campaign template"}}
				</div>
			</div>
		</template>
		<template v-slot:right>
			<campaignTemplateMenu v-if="!loading && campaignTemplate" :campaignTemplate="campaignTemplate"/>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<linepreloader v-if="loading"/>

			<campaignTemplateMain v-if="!loading && campaignTemplate" :campaignTemplate="campaignTemplate"/>

		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.name
	font-weight : 700
	font-size: 1.3em
</style>

<script>

import campaignTemplateMain from '@/components/modules/campaigns/template/main/index.vue'
import campaignTemplateMenu from '@/components/modules/campaigns/template/menu/index.vue'


export default {
	name: 'campaign_page',
	components: {
        campaignTemplateMain,
		campaignTemplateMenu
	},

	data : function(){
		return {
			campaignTemplate : null,
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

			

			console.log('this.id', this.id)

			if (this.id != 'new'){

				this.loading = true


				this.core.campaigns.getTemplate(this.id).then(r => {
					this.campaignTemplate = r
				}).finally(() => {
					this.loading = false
				})
			}
			else{
				this.campaignTemplate = this.core.campaigns.campaignTemplates.create() 

				this.loading = false
			}

            
        }
	},

	created(){
		this.load()
	},

	mounted() {
		
	}
}
</script>
