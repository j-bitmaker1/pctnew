<template>
<div id="portfolios_main">
	<div class="fs mobp">
		<div class="filesystemwrapper">
			<filesystem ref="filesystem" :initialroot="0" :select="select" @selected="selected"/>
		</div>
	</div>

	<portfoliolist :showClient="true" ref="list" @selected="selected" :additional="additional" :select="select"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
