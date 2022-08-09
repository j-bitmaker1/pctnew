<template>
<div class="client_linepreview">
	<div class="userpicWrapper">
		<userpic :userinfo="profile" />
	</div>

	<div class="name">
		<span>{{profile.FName}} {{profile.LName}}</span> 
		
	</div>
	<div class="email">
		<span>&lt;<avalue :value="profile.Email"/>&gt;</span>
		<i v-if="profile.Type == 'CLIENT'" class="fas fa-check-circle verify"></i>
	</div>
</div>
</template>

<style scoped lang="sass">
.client_linepreview
	display: flex
	align-items: center
	grid-gap: $r

	.name
		white-space: nowrap

	.email
		white-space: nowrap
		span
			color : srgb(--color-bg-ac-bright)

	::v-deep
		.userpicWrapper
			max-width: 22px
			min-width: 22px
			width: 22px
			line-height: 22px
			font-size: 0.6em

	.verify
		margin-left: $r
		color : srgb(--color-txt-ac)
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'client_linepreview',
	props: {
		profile: Object
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
