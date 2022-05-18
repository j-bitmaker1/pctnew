<template>
<div id="client_portfolios">

	<div class="panel mobp">
		<button class="button" @click="create">Create portfolio</button>
		<button class="button black" @click="select">Select portfolios</button>
	</div>

	<portfoliolist path="/" ref="list" :additional="payload"></portfoliolist>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
