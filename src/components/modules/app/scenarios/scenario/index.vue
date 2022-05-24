<template>
	<div class="scenarios_scenario">
		
		<div class="nameWrapper">
			<div class="name">
				<span>{{scenario.name}}</span>
			</div>

			<div class="forcheck" @click="use">
				<i class="fas fa-circle" v-if="!using"></i>
				<i class="fas fa-check-circle good" v-else></i>
			</div>
		</div>
		

		<div class="description">
			<span>{{scenario.shocks}}</span>
		</div>


		<div class="keywords infopt" v-if="scenario.region || scenario.keywords.length">
			<span class="liketicker">{{scenario.region}}</span> <tags :tags="scenario.keywords"/>
		</div>

	</div>
	

</template>

<style scoped lang="sass">
.keywords
	white-space: nowrap
	overflow: hidden
	text-overflow: ellipsis
.description
	margin-bottom: 2 * $r
	span
		font-size: 0.8em
.nameWrapper
	margin-bottom: $r
	display: flex
	align-items: flex-start
	justify-content: space-between

	.forcheck
		margin-left: auto

		i
			color : srgb(--neutral-grad-0)

			&.good
				color : srgb(--color-good)

	.name
		padding-right: 6 * $r
		span
			font-weight: 700
			font-size: 1.2em
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'scenarios_scenario',
	props: {
		scenario: Object,
		using : Boolean
	},
	computed: mapState({
		auth: state => state.auth,

		
	}),

	methods: {
		use : function(){
			this.$emit('use', this.using ? false : true)
		}
	},
}
</script>
