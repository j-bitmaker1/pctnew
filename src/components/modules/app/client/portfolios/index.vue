<template>
<div id="client_portfolios">

	<div class="summary mobp">
		<summarybutton :colored="true" :reversed="item.reversed" v-for="item in summary" :key="item.index" :text="item.text" :number="item.c(profile[item.index])" @click="e => {item.click ? item.click() : null}"/>
	</div>

	<div class="subcaption mobp">
		<span>Portfolios</span>
	</div>

	<div class="panel mobp">
		<button class="button" @click="create">Create portfolio</button>
		<button class="button black" @click="select">Select portfolios</button>
	</div>

	<portfoliolist @changeClient="reload" @open="open" ref="list" :additional="payload"></portfoliolist>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
