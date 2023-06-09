<template>
<div id="adviserInfo">
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'adviserInfo',
	props: {
		data: Object
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
