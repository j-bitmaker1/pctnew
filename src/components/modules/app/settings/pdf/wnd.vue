<template>
<div id="settings_pdf_wnd">
	<div class="wrapper">
		<settings />
	</div>
</div>
</template>

<style scoped lang="sass">
.wrapper
	padding : 2 * $r

::v-deep
	.row
		.label
			span
				font-weight: 400
				font-size: 1em
</style>

<script>
import {
	mapState
} from 'vuex';

import settings from './index.vue'

export default {
	name: 'settings_pdf_wnd',
	props: {
		data: Object
	},
	components : {
		settings
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
