<template>
<div class="portfolio_client" :class="{small}">

	<div class="line">

		<div class="profilerow row">
			<div class="userpicWrapper">
				<userpic :userinfo="profile" />
			</div>

			<div class="data" v-if="profile">
				<div class="name"><span>{{profile.FName}} {{profile.LName}}</span></div>
				<div class="email" v-if="!small"><span>{{profile.Email}}</span></div>
			</div>

			<!---->
		</div>

		
	</div>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
