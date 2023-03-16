<template>
<div class="activity_comparewith" @click="open">
	<div class="namerow">
		<div class="namewrapper" >
			<div class="name"><span>{{portfolio.name}}</span></div> 
		</div>

		<div class="total">
			<value :value="portfolio.total" :mode="portfolio.isModel ? 'p100' : 'd'" />
		</div>

	</div>

	<div class="structure">
		<div class="namewrapper" >
			<div class="name"><span>{{annuityWeighted.name || annuityWeighted.ticker}}</span></div> 
		</div>

		<div class="total">
			<value :value="annuityWeighted.value" :mode="portfolio.isModel ? 'p100' : 'd'" />
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

.activity_compare
	border-bottom: 1px solid srgb(--neutral-grad-0)
	padding : 2 * $r 0

.structure,
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
		portfolio: Object,
		annuityWeighted : Object
	},
	computed: mapState({
		auth: state => state.auth,

		total : function(){
			
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
