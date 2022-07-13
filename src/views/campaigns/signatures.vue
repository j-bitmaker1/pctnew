<template>
<div class="page">

	<topheader back="/campaigns?p=settings">
		<template v-slot:info>
			<span>Signatures</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				<i class="fas fa-plus" @click="newmenu"></i>
			</div>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>

			<signatures />

		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import signatures from '@/components/modules/campaigns/signatures/index.vue'
import { mapState } from 'vuex';
export default {
	name: 'signatures_page',
	components: {
		signatures
	},

	computed: {
		
		...mapState({
			mobileview : state => state.mobileview,
		})
	},

	data : function(){
		return {
			
		}
	},

	methods: {
		newmenu : function(){

			var items = []
				items.push({
					text: 'campaigns.labels.newsignature',
					icon: 'fas fa-plus',
					action: this.newSignature
				})

			this.core.vueapi.listmenu(items)
		},
		newSignature : function(){
			this.$router.push('/signature/new').catch(e => {})
		},
	},

	mounted() {

	}
}
</script>
