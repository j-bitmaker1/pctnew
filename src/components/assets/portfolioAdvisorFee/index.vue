<template>
	<div class="portfolioAdvisorFee" :title="'Advisor Fee: ' + (portfolio.advisorFee * 100).toFixed(2) + '%'">
		<value mode="p" :value="portfolio.advisorFee" />
	</div>
</template>

<style scoped lang="sass">
.portfolioAdvisorFee
	display: inline-block
	font-size: 0.7em
	padding : 0.5 * $r
	border-radius: $r
	background: srgb(--color-bad)
	color : srgb(--text-on-bg-shadow-color)
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'portfolioAdvisorFee',
	props: {
		portfolio: Object
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
