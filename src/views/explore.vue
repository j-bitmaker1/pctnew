<template>
<div class="page">

	<topheader back="/">
		<template v-slot:info>
			<span>Explore</span>
		</template>
		<template v-slot:right>

		</template>
	</topheader>

	<maincontent>

		<template v-slot:content>
            <homesearch />
		</template>

	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import homesearch from "@/components/modules/app/home/search/index.vue";

export default {
	name: 'explore_page',
	components: {
        homesearch
	},

	computed: {

	},

	methods: {

	},

	mounted() {

	}
}
</script>
