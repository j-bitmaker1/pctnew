<template>
<div class="portfolio_crashtest_details">

	<div class="header mobp">
		<div class="caption">
			<span>Scenarios</span>
		</div>

		<div class="addcustom">
			<button class="button" @click="customStressTest">Custom scenario</button>
		</div>
	</div>
	

	<list :items="cts.scenarios || []">
		<template v-slot:default="slotProps">

			<div class="scenarioWrapper mobp"  :class="{lighted : lighted == slotProps.item.id}">
				<scenario :portfolios="portfolios" :mode="mode" @select="i => select(slotProps.item, i)" :ref="slotProps.item.id" :scenario="slotProps.item" :cts="cts" />
			</div>

		</template>
	</list>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
