<template>
<div id="leads">
	<div class="controls mobp">
		<listcontrols :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" />
	</div>
	<listpaginated context="leads" api="crm.contacts.list" :payload="payload" :start="1" ref="list" @count="setcount">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<lead :hasmenu="hasmenu" :profile="slotProps.item"  @open="open" @leadtocontact="leadtocontactClbk" @deletelead="deletelead"/>
			</div>
		</template>
	</listpaginated>

	<selection context="leads" :menu="menu"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
