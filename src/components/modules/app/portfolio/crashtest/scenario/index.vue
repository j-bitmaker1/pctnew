<template>
<div class="portfolio_crashtest_scenario">
	<div class="header">
		<div class="name">
			<span>{{scenario.name}}</span>
		</div>
		<div class="more">
			<i class="fas fa-angle-down"></i>
		</div>
	</div>
	<div class="lineWrapper">
		<div class="line">
			<div class="fill" :style="{width : width + '%', background:color}">
			</div>
		</div>
	</div>
	<div class="dataWrapper">
		<div class="contributors">
			
		</div>
		<div class="value">
			<value :value="scenario.loss" mode="auto"/>
		</div>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
