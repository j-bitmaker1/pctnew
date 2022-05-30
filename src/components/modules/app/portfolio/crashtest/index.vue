<template>
<div id="portfolios_crashtest">

	<linepreloader v-if="loading"/>

	<div class="ct" v-else>

		<div class="summary mobp">
			<summarybutton :reversed="true" :colored="true" v-for="item in summary" :key="item.index" :text="item.text" :number="item.index ? ct[item.index] : th[item.th]"/>
		</div>

		<div class="header mobp">
			<div class="forpanel">
				<iconstoggle :icons="valuemodes" :value="valuemode" @change="changevaluemode"/>
			</div>
			<div class="forsettigns">
				<ctmenu :ct="ct"/>
				<!--<div class="diconbutton">
					<i class="fas fa-cog"></i>
				</div>-->
			</div>
		</div>

		<div class="subheader mobp">
			<div class="forvalue">
				<value :value="portfolio.total() + portfolio.uncovered()" mode="auto"/>
			</div>
			<div class="forvalues">
			   <div class="positive" v-if="ct.profit"><i class="fas fa-arrow-up"></i> <value :value="ct.profit" mode="auto" colored="true"/></div>
			   <div class="negative" v-if="ct.loss"><i class="fas fa-arrow-down"></i> <value :value="ct.loss" mode="auto" colored="true"/></div>
			</div>
		</div>

		<div class="chartWrapper mobp">
			<chart :ct="ct" @scenarioClick="toScenario"/>
		</div>

		<div class="caption mobp">
			<span>Details</span>
		</div>

		<div class="detailsWrapper mobp">
			<ctdetails ref="ctdetails" :ct="ct" :portfolio="portfolio"/>
		</div>

	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
