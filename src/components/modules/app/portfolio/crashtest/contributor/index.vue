<template>
<div class="portfolio_crashtest_contributor">

	

	<div class="header topheader">
		<div class="ticker">
			{{contributor.asset.ticker}}
		</div>
		<div class="value">
			<value :value="contributor.value" :mode="mode"/>
		</div>
	</div>

	<div class="header">
		<div class="name">
			<span>{{contributor.asset.name}}</span>
		</div>
		
	</div>
	<div class="lineWrapper">
		<div class="line">
			<div class="fill" :style="{width : width + '%', background:color}">
			</div>
		</div>
	</div>
   
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
