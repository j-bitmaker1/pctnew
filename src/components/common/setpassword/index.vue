<template>
<div id="setnewpassword">
	<linepreloader v-if="loading"/>
	<div v-if="(hash || pin) && !loading">
		<div class="caption mobp">
			<span>{{ $t("common.2901029") }}</span>
		</div>

		<div class="item mobp">
			<div class="label">
				<label for="password">{{ $t("common.2901030") }}</label>
			</div>
			<div class="input">
				<cpassword :value="password" @input="changePassword" name="password" autocomplete="off" :placeholder="$t('common.2901031')" :toggle="true" :badge="false" />
			</div>
		</div>

		<div class="item mobp">
			<div class="label">
				<label for="cpassword">{{ $t("common.2901032") }}</label>
			</div>
			<div class="input">
				<input type="password" @input="confirmpassword = $event.target.value" :value="confirmpassword" autocomplete="off" name="cpassword" :placeholder="$t('labels.confirmyourpassword')" />
			</div>
		</div>

		<div class="savePanel mobp">
			<button v-if="!hash" @click="load" class="button ghost">Enter another PIN code</button>
			<button class="button" @click="send" :disabled="!valid">
				Next
			</button>
		</div>
	</div>

	<div class="mobp error" v-if="(!hash && !pin) && !loading">
		<div>
			<span>To change your password, you need to follow the link that was sent to your mail, or by entering the pin code</span>
		</div>

		<div class="savePanel mobp">
			<button class="button" @click="load">
				Enter PIN code
			</button>
		</div>
	</div>

</div>
</template>

<style scoped lang="sass">
#setnewpassword
	padding : 0 $r

.caption
	max-width: 70%
	margin-bottom: 4 * $r

	span
		font-size: 2em
		font-weight: 100
.item
	margin-top : 2 * $r
	.label
		color : srgb(--color-bg-ac-bright)
		margin-bottom: $r

.error
	span
		font-size: 2em
input
	background: srgb(--background-secondary-theme)
	padding : 0 3 * $r
	height: 66px
	background: srgb(--neutral-grad-0)
	width : 100%
	border-radius: 12px

::v-deep
	.Password__field
		border-radius: 12px
		padding : 0 3 * $r
		height: 66px
		background: srgb(--neutral-grad-0)
		width : 100%
		border : 0
		
	.Password__strength-meter
		border-radius: 12px

	.Password__badge
		border-radius: 50px
		height: 30px
		line-height: 30px
		font-size: 0.9em

</style>

<script>
import {
	mapState
} from "vuex";
import cpassword from "vue-password-strength-meter";

export default {
	name: "setnewpassword",
	props: {
		data: Object,
	},
	components: {
		cpassword,
	},
	data: function () {
		return {
			password: "",
			confirmpassword: "",
			hash: '',
			pin : '',
			loading: false,
			email : ''
		};
	},
	computed: mapState({
		auth: (state) => state.auth,
		valid: function () {
			return this.password && this.password == this.confirmpassword;
		},
	}),

	mounted: function () {
		this.load();
	},

	methods: {
		changePassword: function (v) {
			this.password = v;
		},
		load: function () {
			this.hash = this.$route.query.code;
			this.email = this.$route.query.login;

			if(!this.hash){

				this.loading = true

				this.core.vueapi.pincode('enter', 1, null, "Enter the PIN code to change the password that came to your mail").then(pin => {
					this.pin = pin
				}).finally(() => {
					this.loading = false
				})

			}
		},

		send: function () {

			if (this.hash && this.email){

				this.core.api.user.restorePasswordContinue({
					password : this.password,
					pin : this.pin,
					email : this.email
				}, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$router.push('/')
				})

			}	
			else{	
				this.core.api.user.changePassword({
					password : this.password,
					pin : this.pin
				}, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$router.push('/')
				})
			}

			

		},
	},
};
</script>
