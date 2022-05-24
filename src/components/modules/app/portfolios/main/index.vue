<template>
<div id="portfolios_main">

	<div key="filesystem" class="fs mobp partwr" >
		<div class="filesystemwrapper">
			<filesystem :select="fsselect" ref="filesystem" :initialroot="0" @open="open"/>
		</div>
	</div>
	
	<div class="portfolioListWrapper partwr">
		<portfoliolist :select="pfselect" key="list" :showClient="true" ref="list" :additional="additional" @open="open"/>
	</div>

	<selection context="portfolio" @success="selected"/>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
