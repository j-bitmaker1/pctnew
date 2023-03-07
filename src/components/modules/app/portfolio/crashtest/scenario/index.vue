<template>
<div class="portfolio_crashtest_scenario" :class="{showNames}" @click="selectIfOne">
	<div class="header">
		<div class="name">
			<span>{{scenario.name}}</span> <span class="custom" v-if="scenario.custom">Custom scenario</span>
		</div>
		<div class="more" v-if="!showNames">
			<i class="fas fa-angle-down"></i>
		</div>
	</div>

	<div :key="i" v-for="(loss, i) in scenario.loss" @click="select(i)">

		<div class="lineWrapper">
			<div class="line" >
				<div class="fill" :style="{width : width(loss) + '%', background:color(loss)}">
				</div>
			</div>
		</div>
		<div class="dataWrapper">
			<div class="portfolio" v-if="showNames">
				<span>{{showName(i)}}</span>
			</div>
			
			<div class="value">
				<value :value="cts.total * loss" :mode="mode"/>
			</div>
		</div>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
