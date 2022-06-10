<template>
<div class="summarybutton" :class="sclass">
	<div class="label" @click="click">
		<span>{{$t(text)}}</span>
	</div>

	<div class="value" @click="click">
		<coloredNumber v-if="colored" :reversed="reversed" :number="number" :mode="mode"/>
		<value v-else :value="number" :mode="mode"/>
	</div>

	<div class="tip" :tooltip="tip">
		<i class="fas fa-question-circle"></i>
	</div>
</div>
</template>

<style scoped lang="sass">
.summarybutton
	padding : $r
	border-radius: 12px
	border : 1px solid srgb(--neutral-grad-1)
	position: relative
	padding-top : 1.5 * $r

	.tip
		position: absolute
		bottom : $r
		right: $r
		color: srgb(--neutral-grad-1)

	.label
		span
			font-size: 0.9em
			font-weight: 700

	.value
		span
			font-size: 2em
	&.positive
		.value
			color : srgb(--color-good)
	&.negative
		.value
			color : srgb(--color-bad)
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'summarybutton',
	props: {
		text: String,
		number : Number,
		tip : String,
		mode : String,
		colored : Boolean,
		sclass : String,
		reversed : Boolean
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {
		click : function(){
			this.$emit('click')
		}
	},
}
</script>
