<template>
<div class="page index">

	<topheader>
		<template v-slot:info>
			<span>Home</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				
				<i class="fas fa-bars"></i>
				<i class="fas fa-search"></i>
			</div>
		</template>

	</topheader>

	<maincontent>
		<template v-slot:content>
			<home />
		</template>
	</maincontent>

</div>
</template>

<style lang="sass" scoped>

	

</style>

<script>
import home from "@/components/modules/app/home/index.vue";

export default {
	name: 'home_page',
	components: {
		home
	},

	computed: {

	},

	methods: {

	},

	mounted() {

	}
}
</script>
