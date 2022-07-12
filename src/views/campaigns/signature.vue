<template>
<div class="page">

	<topheader back="/campaigns?p=settings">
		<template v-slot:info>
			<div class="header" v-if="!loading && signature">
				<div class="name">
					{{signature.Name || "Create signature"}}
				</div>
			</div>
		</template>
		<template v-slot:right>
			<signatureMenu v-if="!loading && signature && signature.Id" :signature="signature"/>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<linepreloader v-if="loading"/>

			<signatureMain v-if="!loading && signature" :signature="signature"/>

			<div class="empty" v-if="!loading && !signature">
				<span>Signature not found</span>
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

import signatureMain from '@/components/modules/campaigns/signature/main/index.vue'
import signatureMenu from '@/components/modules/campaigns/signature/menu/index.vue'


export default {
	name: 'campaign_page',
	components: {
        signatureMain,
		signatureMenu
	},

	data : function(){
		return {
			signature : null,
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

				this.core.campaigns.getEmailWithBody(this.id).then(r => {
					this.signature = r
				}).catch(e => {}).finally(() => {
					this.loading = false
				})

			}
			else{
				this.signature = this.core.campaigns.createSignature() 

                console.log('this.signature', this.signature)

				this.loading = false
			}

            
        }
	},

	created(){
        console.log("ASD")
		this.load()
	},

	mounted() {
		
	}
}
</script>
