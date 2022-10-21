<template>
<div class="page">

	<topheader back="/campaigns?p=alltemplates&t=templates">
		<template v-slot:info>
			<div class="header" v-if="!loading && campaignTemplate">
				<div class="name">
					{{clone ? "Clone campaign template" : campaignTemplate.Name || "Create campaign template"}}
				</div>
			</div>
		</template>
		<template v-slot:right>
			<campaignTemplateMenu @remove="remove" v-if="!loading && campaignTemplate && campaignTemplate.canedit()" :campaignTemplate="campaignTemplate"/>
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
	white-space: nowrap
	overflow: hidden
	text-overflow: ellipsis
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
				this.core.campaigns.getTemplate(this.id).then(r => {
					this.campaignTemplate = r
				}).finally(() => {
					this.loading = false
				})
			}
			else{

				if (this.$route.query.clone){

					this.core.campaigns.campaignTemplates.clone(this.$route.query.clone).then(tpl => {
						this.campaignTemplate = tpl
						this.clone = true
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

		remove : function(){
			this.$router.replace('/campaigns?p=alltemplates&t=templates').catch(e => {})
		}
	},

	created(){
		//this.load()
	},

	mounted() {
		
	}
}
</script>
