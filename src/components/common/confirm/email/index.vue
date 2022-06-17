<template>
<div id="profile_confirm_email">
	<div class="text mobp">
		<div class="caption">
			<span>An email with a link to verify your account has been sent to the specified email address.</span>
		</div>

		<div class="subcaption">
			<span>{{email}}</span>
		</div>

		<sticker src="email.png"/>


		<div class="contacttosupport">

			<div class="csubcaption">
				Contact support if you don't receive an email
			</div>
			
			<router-link to="/support">
				<button class="button black">Contact support</button>
			</router-link>
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
		email: String
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	methods: {

	},
}
</script>
