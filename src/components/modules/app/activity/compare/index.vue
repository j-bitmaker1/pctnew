<template>
<div class="activity_compare">
	<div class="namerow" :key="portfolio.id" v-for="portfolio in portfolios">
		<div class="namewrapper" @click="open">
			<div class="name"><span>{{portfolio.name}}</span></div> 
		</div>
		<div class="total" @click="open">
			<value :value="portfolio.total" mode="d" />
		</div>
	</div>

	<div class="assets" >
		<div class="actions">
			<div class="action" v-for="action in actions" :key="action.route">
				<i :class="action.icon" @click="to(action.route)"/>
			</div>
		</div>
	</div>

	
</div>
</template>

<style scoped lang="sass">
.activity_compare
	border-bottom: 1px solid srgb(--neutral-grad-0)
	padding : 2 * $r 0

.namerow
	display: flex
	align-content: space-between
	align-items: center
	padding : $r
	border-radius: 12px
	margin-bottom: 0.5 * $r
	background: srgb(--neutral-grad-0)

	span
		font-size: 0.9em

	.namewrapper
		flex-grow: 2


	.total
		span
			font-size: 1.1em
			font-weight: 700

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'activity_portfolio',
	props: {
		portfolios: Array,
		ids : String
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
					route : '/compare?ids=' + this.ids + '&c=allocation'
				},

				{
					icon : 'fas fa-chart-area',
					route : '/compare?ids=' + this.ids + '&c=distribution'
				},
				{
					icon : 'fas fa-chart-bar',
					route : '/compare?ids=' + this.ids + '&c=stress'
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
