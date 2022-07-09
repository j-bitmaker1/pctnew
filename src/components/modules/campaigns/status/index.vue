<template>
<div class="campaigns_status" :class="status">
	<div class="status">

		<i :class="meta.icon"></i>
		<span>{{$t('campaigns.status.' + meta.text)}}</span>

	</div>

	<div class="error" v-if="error">
		<span>{{error}}</span>
	</div>
</div>
</template>

<style scoped lang="sass">
.error
	margin-top: $r
	span
		font-weight: 700
		font-size: 0.8em
		color : srgb(--color-bad)
.status
	display: flex
	align-items: center
	grid-gap: $r

	span
		font-size: 0.9em
		color : srgb(--neutral-grad-2)

.status
	i
		color : srgb(--neutral-grad-2)

.campaigns_status.COMPLETED
	.status
		i
			color : srgb(--color-good)


</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'campaigns_status',
	props: {
		status: String,
		error : String
	},
	computed: mapState({
		auth: state => state.auth,

		meta : function(){
			return this.core.campaigns.statuses[this.status] || this.core.campaigns.statuses.default
		}
	}),

	methods: {

	},
}
</script>
