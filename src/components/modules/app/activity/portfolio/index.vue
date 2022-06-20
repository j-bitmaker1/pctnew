<template>
<div class="activity_portfolio">
	<div class="namerow">
		<div class="namewrapper" @click="open">
			<div class="name"><span>{{portfolio.name}}</span></div> 
		</div>

		<div class="total" @click="open">
			<value :value="total" mode="d" />
		</div>

	</div>

	<div class="assets" >
		<div class="actions">
			<div class="action" v-for="action in actions" :key="action.route">
				<i :class="action.icon" @click="to(action.route)"/>
			</div>
		</div>
		<div class="assetsClList" @click="open">
			<div class="ticker" :uncovered="!asset.isCovered" :key="i" v-for="(asset, i) in portfolio.positions">
				<span>{{asset.ticker}}</span>
			</div>
		</div>
		
	</div>

	
</div>
</template>

<style scoped lang="sass">

@media (pointer:fine)
	.namewrapper,
	.total,
	.action
		cursor: pointer
		
.activity_portfolio
	border-bottom: 1px solid srgb(--neutral-grad-0)
	padding : 2 * $r 0

.namerow
	display: flex
	align-content: space-between
	align-items: center
	
	

	.namewrapper
		flex-grow: 2
	.name
		span

	.assets
		margin-left: auto

	.total
		span
			font-size: 1.1em
			font-weight: 700

.assets
	display: flex
	flex-wrap: nowrap
	align-content: space-between
	align-items: center
	grid-gap: $r
	overflow-x: auto
	margin-top: 2 * $r
	scrollbar-width : none
	&::-webkit-scrollbar
		display: none

	.assetsClList
		display: flex
		flex-wrap: nowrap
		align-content: space-between
		align-items: center
		grid-gap: $r

		.ticker
			overflow: hidden
			text-overflow: ellipsis

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

		actions : function(){
			return [
				{
					icon : 'fas fa-chart-pie',
					route : '/portfolio/' + this.portfolio.id + '?p=shares&s=allocation'
				},

				{
					icon : 'fas fa-chart-area',
					route : '/portfolio/' + this.portfolio.id + '?p=shares&s=distribution'
				},
				{
					icon : 'fas fa-chart-bar',
					route : '/portfolio/' + this.portfolio.id + '?p=crashtest'
				},

			]
		}
	}),

	methods: {
		open : function(){
			this.$emit('open')
		},

		to : function(to){
			this.$emit('to', to)
		}
	},
}
</script>
