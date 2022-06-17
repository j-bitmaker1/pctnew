<template>
<div class="registration_page">

	<topheader back="/">
		<template v-slot:info>
			<span>Registration</span>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<registration />
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import registration from '@/components/common/registration/index.vue'

export default {
	name: 'registration_page',
	components: {
		registration
	},

	computed: {

	},

	methods: {

	},

	mounted() {

	}
}
</script>
