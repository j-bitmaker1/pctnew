<template>
<div id="rx-profile">
	<div class="cardWrapper mobp">
		<card :userinfo="userinfo" />
	</div>

	<!--<div class="infoWrapper mobp">Additional Info</div>-->

	<div class="settings mobp">

		<div class="subcaption">
			<span>Settings</span>
		</div>

		<settings />
		
	</div>


	<div class="signout mobp" @click="signout">
		<button class="button black small">{{ $t("common.2901049") }}</button>
	</div>

	<div class="version mobp">
		<span>Larkspur-Rixtrema &middot; Portfolio Crash Test &middot; v{{version}}</span>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
