<template>
<div id="rx-profile">
	<div class="cardWrapper mobp">
		<card :userinfo="userinfo" />
	</div>

	<div class="infoWrapper mobp">Additional Info</div>

	<div class="themeToggleWrapper mobp">
		<themeToggle />
	</div>

	<div class="actions mobp">
		<div class="action">
			<router-link to="/changepassword">
				<button class="button">Change Password</button>
			</router-link>
		</div>
	</div>

	<div class="signout mobp" @click="signout">
		<span>{{ $t("common.2901049") }}</span>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
