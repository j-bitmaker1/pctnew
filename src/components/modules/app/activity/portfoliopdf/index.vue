<template>
<div class="activity_portfoliopdf" @click="open">
	<div class="namerow">
		<div class="namewrapper">
			<div class="name"><span>{{name}}</span></div> 
		</div>

		<div class="total">
			<button class="button">
                Create PDF report
            </button>
		</div>
	</div>

	
</div>
</template>

<style scoped lang="sass">
.activity_portfolio
	border-bottom: 1px solid srgb(--neutral-grad-0)
	padding : 2 * $r 0

@media (pointer:fine)
	.activity_portfolio
		cursor: pointer

.namerow
	display: flex
	align-content: space-between
	align-items: center

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
	name: 'activity_portfoliopdf',
	props: {
        name : String
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {
		open : function(){
			this.$emit('open')
		}
	},
}
</script>
