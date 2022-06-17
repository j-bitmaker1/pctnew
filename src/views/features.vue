<template>
<div class="features_page page">

	<topheader back="/profile">
		<template v-slot:info>
			<span>Licence</span>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<licence />
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import licence from "@/components/modules/profile/licence/index.vue"

export default {
	name: 'features_page',
	components: {
		licence
	},

	computed: {

	},

	methods: {

	},

	mounted() {

	}
}
</script>
