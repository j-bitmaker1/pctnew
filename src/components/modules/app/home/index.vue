<template>
<div id="home">
    <div class="buttonsWrapper">
		<bigmainbutton icon="fas fa-users" :label="$t('menu.clients')" blabel="55" :active="true" nlabel="+4"/>
		<bigmainbutton icon="fas fa-user-plus" :label="$t('menu.leads')" blabel="1255" nlabel="+4"/>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
