<template>
<div class="campaigns_variable">

	<div class="id">
		<span>@{{variable.id}}</span>
	</div>
	<div class="name">
		<span>{{variable.name}}</span>
	</div>

</div>
</template>

<style scoped lang="sass">
.id
	span
		font-size: 0.8em
		font-weight: 700
		color : srgb(--color-txt-main)
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'campaigns_variable',
	props: {
		variable : Object
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
