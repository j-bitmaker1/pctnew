<template>
<div class="activity_portfolio">
	<div class="namerow">
		<div class="namewrapper" @click="open">
			<div class="name"><span>{{portfolio.name}}</span></div> 
		</div>

		<div class="actions">
			<slot name="actions"></slot>
		</div>

		<div class="assets" @click="open">

			<div class="assetsClList">
				<div class="ticker" :key="i" v-if="i < 5" v-for="(asset, i) in portfolio.positions">
					<span>{{asset.ticker}}</span>
				</div>
			</div>
		</div>

		<div class="total" @click="open">
			<value :value="total" mode="d" />
		</div>

	</div>

	
</div>
</template>

<style scoped lang="sass">
.namerow
	display: flex
	align-content: space-between
	align-items: center
	padding : 2 * $r 0
	padding-left: $r
	border-bottom: 1px solid srgb(--neutral-grad-0)

	.namewrapper
		flex-grow: 2
	.name
		span

	.assets
		margin-left: auto

	.total
		padding-right: $r

		span
			font-size: 1.1em
			font-weight: 700

.assets
	display: flex
	flex-wrap: nowrap
	align-content: space-between
	align-items: flex-start
	grid-gap: $r
	margin-right: 2 * $r

	.assetsClList
		display: flex
		flex-wrap: wrap
		align-content: space-between
		align-items: center
		grid-gap: $r

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'activity_portfolio',
	props: {
		portfolio: Object
	},
	computed: mapState({
		auth: state => state.auth,

		total : function(){
			return _.reduce(this.portfolio.positions, (m, p) => {
				return m + p.value
			}, 0)
		},
	}),

	methods: {
		open : function(){
			this.$emit('open')
		}
	},
}
</script>
