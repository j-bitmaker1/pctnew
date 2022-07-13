<template>
<div class="page">

	<topheader back="/signatures">
		<template v-slot:info>
			<div class="header" v-if="!loading && signature">
				<div class="name">
					{{signature.Name || "Create signature"}}
				</div>
			</div>
		</template>
		<template v-slot:right>
			<signatureMenu @deleted="deleted" v-if="!loading && signature && signature.Id" :signature="signature"/>
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

				this.core.campaigns.getSignatureWithData(this.id).then(r => {
					console.log("R", r)
					this.signature = r
				}).catch(e => {
					console.error(e)
				}).finally(() => {
					this.loading = false
				})

			}
			else{
				this.signature = this.core.campaigns.emptySignature() 

                console.log('this.signature', this.signature)

				this.loading = false
			}

            
        },

		deleted : function(){
			this.$router.push('/signatures')
		}
	},

	created(){
	},

	mounted() {
		
	}
}
</script>
