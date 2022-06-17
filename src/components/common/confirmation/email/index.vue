<template>
<div id="profile_confirm_email">
	<div class="text mobp">

		<div class="hashash" v-if="hash">

			<div class="caption">
				<span v-if="loading">Account is in the verification process</span>

				<span v-if="!loading && success">Account verified successfully. Now you will be redirected to the login page</span>

				<span v-if="!loading && !success">An error occurred while verifying the email. Please contact support</span>
			</div>

			<sticker src="goal.png" v-if="success"/>
			<sticker src="24-hours-support.png" v-if="!success && !loading"/>

			<div class="contacttosupport" v-if="!loading && !success">

				<router-link to="/support">
					<button class="button black">Contact support</button>
				</router-link>
			</div>

		</div>
		<div v-else>
			<div class="caption">
				<span>404 Error</span>
			</div>
		</div>
		
	</div>
</div>
</template>

<style scoped lang="sass">

.text
	text-align: center
	width: 80%
	margin : 0 auto

.subcaption
	margin-top: 3 * $r
	margin-bottom: 3 * $r
	span
		color : srgb(--color-txt-ac)
		font-weight: 700

.caption
	margin-bottom: 6 * $r
	span
		font-size: 2em

.contacttosupport
	margin-top: 4 * $r

	.csubcaption
		margin-bottom: 4 * $r

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'profile_confirm_email',
	props: {
		hash: String
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	data : function(){
		return {
			loading : true,
			success : false
		}
	},

	created : function(){
		this.confirm()
	},

	methods: {
		confirm : function(){
			if (this.hash){
				this.loading = true

				this.$store.commit('globalpreloader', true)

				this.core.api.user.activate(this.hash).then(r => {
					this.success = true

					setTimeout(() => {

						this.$router.push('/authorization')

					}, 2000)
				}).finally(() => {
					this.loading = false

					this.$store.commit('globalpreloader', false)
				})
			}
			else{
				this.loading = false
			}
		}
	},
}
</script>
