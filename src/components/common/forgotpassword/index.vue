<template>
<div id="setnewpassword">

	<div v-if="!success">
		<div class="caption mobp">
			<span>{{ $t("common.resetpassword") }}</span>
		</div>

		<div class="item mobp">
			<div class="label">
				<label for="cpassword">{{ $t("common.enteremail") }}</label>
			</div>
			<div class="input">
				<input type="email" @input="email = $event.target.value" :value="email" autocomplete="on" name="email" :placeholder="$t('common.2901018')" />
			</div>
		</div>

		<div class="savePanel mobp">
			<button class="button" @click="send" :disabled="!email">
				Next
			</button>
		</div>
	</div>

	<div v-else>
		<div class="caption mobp">
			<span>{{ $t("common.resetpasswordsuccess") }}</span>
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


</style>

<script>
import {
	mapState
} from "vuex";

export default {
	name: "forgotpassword",
	props: {
		data: Object,
	},
	components: {
	},
	data: function () {
		return {
			email: "",
			success : false
		};
	},
	computed: mapState({
		auth: (state) => state.auth
	}),

	mounted: function () {
	},

	methods: {

		send: function () {

			this.core.api.user.restorePassword({
				email : this.email
			}, {
				preloader : true,
				showStatus : true
			}).then(r => {
				this.success = true
			})

		},
	},
};
</script>
