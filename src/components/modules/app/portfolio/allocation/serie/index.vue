<template>
<div class="portfolio_allocation_serie">
	<div class="color" >
		<div class="marker" :style="{background : color}">
		</div>
	</div>

	<div class="name">
		<span>{{name}}</span>
	</div>

	<div class="value">
		<value :value="y" :mode="mode"/>
	</div>
</div>
</template>

<style scoped lang="sass">
.portfolio_allocation_serie
	display: flex
	align-items: center
	align-content: space-between
	padding : $r 0

	.color
		flex-basis: 44px

	.value
		
		margin-left: auto

	.marker
		margin : 0 auto
		border-radius: 6px
		height: 22px
		width: 22px
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'portfolio_allocation_serie',
	props: {
		name: String,
		y : Number,
		color : String,

		mode : {
			type : String,
			default : 'd'
		}
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
