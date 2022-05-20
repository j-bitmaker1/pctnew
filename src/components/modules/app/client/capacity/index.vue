<template>
<div id="client_capacity">
	<capacity />
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

import capacity from "@/components/modules/app/features/capacity/index.vue"

export default {
	name: 'client_capacity',
	props: {
		data: Object
	},
	components : {
		capacity
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
