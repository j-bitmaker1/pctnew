<template>
<div class="abspage">

	<topheader>
	  <template v-slot:info>
		<logotype />
	  </template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<riscscore />
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import riscscore from "@/components/modules/app/riscscore/index.vue";

export default {
	name: 'riscscore_page',
	components: {
        riscscore
	},

	computed: {

	},

	methods: {

	},

	mounted() {

	}
}
</script>
