<template>
<div id="factoranalysis_factor" :class="{rotated}">
	<div class="min val">
		<input v-if="factor" :placeholder="factor.min" @change="(e) => {change('min', e.target.value)}"/>
	</div>

	<div class="name" @click="changeFactor">
		<span v-if="factor">{{factor.name}}</span>
		<span v-else class="selectFactor">Select factor</span>
	</div>

	<div class="max val">
		<input v-if="factor" :placeholder="factor.max" @change="(e) => {change('max', e.target.value)}"/>
	</div>
</div>
</template>

<style scoped lang="sass">

#factoranalysis_factor
	display: flex
	align-items: center
	justify-content: space-between
	width: 100%
	height: 100%

	.selectFactor
		text-decoration: underline
		color : srgb(--color-txt-ac)

	.val
		flex-basis: 70px
		text-align: center
		

		input
			border-radius: 6px
			background: srgb(--neutral-grad-0)
			width: 100%
			text-align: center
			height: 33px
			font-size: 0.8em
			

	.name
		text-align: center
		flex-grow: 2
		padding-left: 2 * $r
		padding-right: 2 * $r
		

		span
			font-size: 0.8em

	@media (pointer:fine)
		.name
			+transition(0.3s)
			cursor: pointer
			&:hover
				color : srgb(--color-txt-ac)

	&.rotated
		flex-direction: column

		.val
			flex-basis: 70px
			display: flex
			flex-direction: column
			justify-content: center

		.name
			display: flex
			flex-direction: column
			justify-content: center
			padding : 0

		/*.name
			vertical-align: center
			span
				writing-mode: vertical-rl*/

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'factoranalysis_factor',
	props: {
		factor: {
			type : Object,
			default : () => {return {}}
		},
		rotated : Boolean
	},
	computed: mapState({
		auth: state => state.auth,
	
	}),

	methods: {
		changeFactor : function(){
			this.$emit('changeFactor')
		},

		change : function(i, v){
			this.$emit('change', {
				index : i,
				value : v
			})
		}
	},	
}
</script>
