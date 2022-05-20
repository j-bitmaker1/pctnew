<template>
<div class="abspage">

	<topheader :back="back">
	  <template v-slot:info>
		<logotype />
	  </template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<riskscore />
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">
::v-deep
	.stickedTop
		top : 0
</style>

<script>

import riskscore from "@/components/modules/app/riskscore/index.vue";
import { mapState } from 'vuex';

export default {
	name: 'riskscore_page',
	components: {
        riskscore
	},

	computed: mapState({
		auth : state => state.auth,
		back : function(){
			if(!this.auth) return null
	
			return "/"
		}
	}),


	methods: {

	},

	mounted() {

	}
}
</script>
