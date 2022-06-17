<template>
<div class="confirm_page page">

	<topheader back="/"/>

	<maincontent>
		<template v-slot:content>
			<component :is="c" v-if="c" v-bind="data"/>
            <div v-else></div>
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import email from '@/components/common/confirm/email/index.vue'


export default {
	name: 'confirm_page',
	components: {
		email
	},

	computed: {
        c : function(){

			var t = this.$route.query.type
            return t
        },

		data : function(){
            return this.$route.query || {}
        }
	},

	methods: {

	},

	mounted() {

	}
}
</script>
