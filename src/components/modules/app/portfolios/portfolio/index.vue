<template>
<div class="portfolios_portfolio" :class="{deleted : portfolio.status == 'DELETED'}">



	<div class="namerow">
		<div class="namewrapper" @click="click">
			<div class="name"><span>{{portfolio.name}}</span></div> 
			<div class="date"><date :date="portfolio.created" /></div>
		</div>

		<div class="forsettings" v-if="hasmenu">

			<portfoliomenu @gotofolder="gotofolder" @edit="editportfolio" @delete="deleteportfolio" :portfolio="portfolio" buttonclass="diconbutton"/>

		</div>
	</div>

	

	<div class="assets" @click="click">

		<div class="assetsClList">
			
			<div class="ticker" :uncovered="!asset.isCovered" v-if="i < 5" v-for="(asset, i) in portfolio.positions">
				<span>{{asset.ticker}}</span>
			</div>
			<div class="clientrow" v-if="showClient && profile">
				<client :profile="profile" :small="true"/>
			</div>
		</div>

		<div class="total">
			<value :value="total" mode="d" />
		</div>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
