<template>
<div id="home">

	<div class="buttonsWrapper mobp" v-if="checkLicenceCRM">
		<router-link to="/clients">
			<bigmainbutton icon="fas fa-users" :label="$t('menu.clients')" :blabel="notifications('totalClients')" :active="true" :nlabel="notifications('clients')" />
		</router-link>
		<router-link to="/leads">
			<bigmainbutton icon="fas fa-user-plus" :label="$t('menu.leads')" :blabel="notifications('totalLeads')" :nlabel="notifications('leads')" />
		</router-link>
	</div>

	<div class="licenceProblems mobp" v-if="!features.PCT || !features.PCT.valid">

		<sticker src="seo.png" />

		<div class="buttons">

			<router-link to="/features">
				<button v-if="!features.PCT" class="button orange">Get PCT licence</button>
				<button v-if="features.PCT && !features.PCT.valid" class="button">Renew PCT license</button>
			</router-link>

		</div>
	</div>

	<div class="notificationsWrapper">
		<div class="captionWrapper mobp">
			<div class="caption">
				<span>Notifications</span>
			</div>
		</div>
		<notifications />
	</div>
	
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
