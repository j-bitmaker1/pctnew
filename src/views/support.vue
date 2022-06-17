<template>
<div class="preabs">

    <topheader back="back">
        <template v-slot:info>
            <span>Support</span>
        </template>

		<template v-slot:right>

			

			<div class="buttonpanel">
				<a href="mailto:clientsuccess@rixtrema.com">
					<i class="fas fa-at"></i>
				</a>
			</div>

			<div class="buttonpanel">
				<a href="tel:12125137070">
					<i class="fas fa-phone"></i>
				</a>
			</div>
		</template>

    </topheader>

    <maincontent>
        <template v-slot:content>
            <iframe src="https://tawk.to/chat/5d49cef27d27204601c99db5/default" />
        </template>
    </maincontent>

</div>
</template>

<style lang="sass" scoped>

::v-deep
	#maincontent
		bottom: 76px!important

iframe
	position: absolute
	left: 0
	top : 0
	bottom : 0
	right: 0
	width: 100%
	height: 100%
</style>

<script>
export default {
    name: 'support_page',
    components: {

    },

    computed: {

    },

    methods: {

    },

    mounted() {

    }
}
</script>
