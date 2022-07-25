<template>
<div id="contacts">
	<div class="controls mobp">
		<listcontrols :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" :store="type || 'contacts'"/>
	</div>

	<div class="added mobp" v-if="added">
		<button class="button" @click="reload">You have a new {{label}} ({{added}})</button>
	</div>
	
	<listpaginated :placeholder="'No ' +label+ 'found'" :activity="type" :select="{...select, ...{context : label}}" api="crm.contacts.list" :payload="payload" :start="1" ref="list" @count="setcount">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<contact :hasmenu="hasmenu" :profile="slotProps.item" @open="open"  @deletecontact="deleteContactFromList" @portfoliosChanged="p => {portfoliosChanged(slotProps.item, p)}"/>
			</div>
		</template>
	   
	</listpaginated>

	<selection :context="label" :menu="menu" @success="selected"/>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
