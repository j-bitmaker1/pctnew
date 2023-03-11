<template>
<div class="contacts_contact" @click="open">

	<div class="line" >

		<div class="profilerow row" >
			<div class="userpicWrapper">
				<userpic :userinfo="profile" />
			</div>

			<div class="data" v-if="profile">
				<div class="name"><span>{{profile.FName}} {{profile.LName}}</span> <i v-if="profile.Type == 'CLIENT'" class="fas fa-check-circle verify"></i></div>
				<div class="email"><span>{{profile.Email}}</span></div>
			</div>

			<!---->
		</div>

		

		<div class="statsrow row" >
			<div>
				<span class="label">Crash Rating</span>
				<coloredNumber :number="profile.riskscore"/>
			</div>

			<div>
				<span class="label">Tolerance</span>
				<coloredNumber :reversed="true" :number="core.pct.ocr(profile.tolerance)"/>
			</div>

			<div>
				<span class="label">Capacity</span>
				<coloredNumber :number="profile.capacity"/>
			</div>

			
		</div>

		<div class="menurow row">
			<div class="menuWrapper">
				<profilemenu v-if="hasmenu" @portfoliosChanged="portfoliosChanged" @edit="edit" @delete="deletecontact" :profile="profile"/>
			</div>
		</div>
	</div>

	<div class="daterow row">
		<date :date="profile.Modified || profile.Created"/>
		<value :value="profile.totalSum" mode="d"/>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
