<template>
<div class="portfolios_portfolio">

	<div class="namerow">
		<div class="namewrapper" @click="click">
			<div class="name"><span>{{portfolio.name}}</span></div> 
			<div class="date"><date :date="portfolio.created" /></div>
		</div>

		<div class="forsettings" v-if="hasmenu">

			<portfoliomenu @edit="editportfolio" @delete="deleteportfolio" :portfolio="portfolio" buttonclass="diconbutton"/>

		</div>
	</div>

   

	<div class="assets" @click="click">
		<div class="ticker" v-if="i < 5" v-for="(asset, i) in portfolio.positions">
			<span>{{asset.ticker}}</span>
		</div>

		<div class="total">
			<value :value="total" mode="d" />
		</div>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
