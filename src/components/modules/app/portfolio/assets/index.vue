<template>
<div id="portfolio_assets">

	<div class="controls mobp">

		<div class="forcaption">
			<span>Positions</span>
		</div>

		<div class="foredit">
			<div class="diconbutton">
				<i class="fas fa-list" @click="edit"></i>
			</div>
		</div>
	</div>

	<div class="assetsWrapper">
		<assets :portfolio="portfolio" :assets="assets" :mode="portfolio.isModel ? 'p100' : 'd'"/>
	</div>

	<div class="total mobp">
		<div class="forcaption">
			<span>Total</span>
		</div>

		<div class="forvalue">
            <value :value="portfolio.total() + portfolio.uncovered()" :mode="portfolio.isModel ? 'p100' : 'd'" />
		</div>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
