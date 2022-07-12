<template>
<div class="faq_page page">

	<topheader back="back">
        <template v-slot:info>
            <span>FAQ</span>
        </template>
		<template v-slot:right>
			<div class="buttonpanel">
				<router-link to="/support">
					<i class="fas fa-headset"></i>
				</router-link>
			</div>
		</template>
    </topheader>

	

	<maincontent>
		<template v-slot:content>
			<faq />
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import faq from '@/components/modules/faq/index.vue'

export default {
	name: 'faq_page',
	components: {
        faq
	},

	computed: {

	},

	methods: {

	},

	mounted() {

	}
}
</script>
