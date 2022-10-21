<template>
<div class="page">

	<topheader back="/campaigns?p=alltemplates&t=emails">
		<template v-slot:info>
			<div class="header" v-if="!loading && emailTemplate">
				<div class="name">
					{{clone ? "Clone email template" : emailTemplate.Name || "Create email template"}}
				</div>
			</div>
		</template>
		<template v-slot:right>
			<emailTemplateMenu v-if="!loading && emailTemplate" :emailTemplate="emailTemplate" @deleted="deleted"/>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<linepreloader v-if="loading"/>

			<emailTemplateMain v-if="!loading && emailTemplate" :emailTemplate="emailTemplate" :clone="clone"/>

			<div class="empty" v-if="!loading && !emailTemplate">
				<span>Email template not found</span>
			</div>

		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
.empty
	text-align: center
	padding : 6 * $r

	span
		font-size: 0.9em
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
			clone : false
		}
	},

	computed: {
        id : function(){
            return this.$route.params.id
        }
	},

	watch : {
		id : {
			immediate : true,
			handler : function(){
				this.load()
			}
		}
	},

	methods: {
        load : function(){

			if (this.id != 'new'){

				this.loading = true

				this.core.campaigns.getEmailWithBody(this.id).then(r => {
					this.emailTemplate = r
					
				}).catch(e => {}).finally(() => {
					this.loading = false
				})

			}
			else{

				if (this.$route.query.clone){

					this.core.campaigns.campaignTemplates.cloneEmailTemplate(this.$route.query.clone).then(tpl => {
						this.emailTemplate = tpl
						this.clone = true
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

		deleted : function(){
			this.$router.replace('/campaigns?p=alltemplates&t=emails')
		}
	},

	created(){
		
	},

	mounted() {
		
	}
}
</script>
