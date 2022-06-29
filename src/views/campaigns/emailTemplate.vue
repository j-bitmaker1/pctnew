<template>
<div class="page">

	<topheader back="back">
		<template v-slot:info>
			<div class="header" v-if="!loading && emailTemplate">
				<div class="name">
					{{emailTemplate.Name || "Create email template"}}
				</div>
			</div>
		</template>
		<template v-slot:right>
			<emailTemplateMenu v-if="!loading && emailTemplate" :emailTemplate="emailTemplate"/>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<linepreloader v-if="loading"/>

			<emailTemplateMain v-if="!loading && emailTemplate" :emailTemplate="emailTemplate"/>

		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.name
	overflow: hidden
	white-space: nowrap
	text-overflow: ellipsis
	font-weight : 700
	font-size: 1.3em
</style>

<script>

import emailTemplateMain from '@/components/modules/campaigns/email/main/index.vue'
import emailTemplateMenu from '@/components/modules/campaigns/email/menu/index.vue'


export default {
	name: 'campaign_page',
	components: {
        emailTemplateMain,
		emailTemplateMenu
	},

	data : function(){
		return {
			emailTemplate : null,
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

			if (this.id != 'new'){

				this.loading = true

				this.core.campaigns.getEmailTemplate(this.id).then(r => {
					this.emailTemplate = r
				}).finally(() => {
					this.loading = false
				})

			}
			else{
				this.emailTemplate = this.core.campaigns.campaignTemplates.createEmailTemplate() 

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
