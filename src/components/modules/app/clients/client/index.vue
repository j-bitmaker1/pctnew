<template>
<div class="clients_client">

	<div class="line">

		<div class="profilerow row" @click="open">
			<div class="userpicWrapper">
				<userpic :userinfo="profile" />
			</div>

			<div class="data" v-if="profile">
				<div class="name"><span>{{profile.FName}} {{profile.LName}}</span></div>
				<div class="email"><span>{{profile.Email}}</span></div>
			</div>

			<!---->
		</div>

		<div class="statsrow row" @click="open">
			<div>
				<span class="label">Crash Rating</span>
				<coloredNumber :number="profile.riskscore"/>
			</div>

			<div>
				<span class="label">Capacity</span>
				<coloredNumber :number="profile.capacity"/>
			</div>

			<div>
				<span class="label">Tolerance</span>
				<coloredNumber :reversed="true" :number="profile.tolerance"/>
			</div>
		</div>

		<div class="menurow row">
			<div class="menuWrapper">
				<profilemenu v-if="hasmenu" @portfoliosChanged="portfoliosChanged" @edit="edit" @delete="deleteclient" :profile="profile"/>
			</div>
		</div>
	</div>

	<div class="daterow row">
		<date :date="profile.Modified || profile.Created"/>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
