<template>
<div class="page">

	<topheader back="back">
		<template v-slot:info>
			<span>Campaigns</span>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<campaigns />
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import campaigns from '@/components/modules/campaigns/index.vue'

export default {
	name: 'campaigns_page',
	components: {
        campaigns
	},

	computed: {

	},

	methods: {

	},

	mounted() {

	}
}
</script>
