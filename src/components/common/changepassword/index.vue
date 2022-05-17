<template>
<div id="wai-changepassword">

	<div class="lwork">

		<div class="maket topCaption">
			<div class="caption section">
				{{ $t("common.2901009") }}
			</div>
		</div>
	</div>

	<div class="maket leftPart">

		<div class="sitelogin section">
			<div class="form">

				<div class="item">
					<div class="label">
						<div class="lwork">
							<span>{{ $t("common.2901011") }}</span>
						</div>
					</div>
					<div class="input"><input type="password" value="" v-model="oldpassword" autocomplete="off"/></div>
				</div>

				<div v-if="canenternew">

					<div class="item">
						<div class="label">
							<div class="lwork">
								<span>{{ $t("common.29010113") }}</span>
							</div>
						</div>
						<div class="input">

							<cpassword :value="password" @input="changePassword" name="password" autocomplete="off"  :toggle="true" :badge="false" />

						</div>
					</div>

					<div class="item">
						<div class="label">
							<div class="lwork">
								<span>{{ $t("common.2901014") }}</span>
							</div>
						</div>
						<div class="input"><input type="password" value="" v-model="confirmpassword" autocomplete="off" /></div>
					</div>

					<div class="lwork">
						<div class="item buttons">
							<button class="enter button small" :disabled="!canchange" v-on:click="change">{{ $t("common.2901016") }}</button>
						</div>

					</div>
				</div>

			</div>

		</div>

	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
