<template>
<div class="portfolio_crashtest_details">.

	<list :items="cts.scenarios || []">
		<template v-slot:default="slotProps">

			<div class="scenarioWrapper"  :class="{lighted : lighted == slotProps.item.id}">
				<scenario :portfolios="portfolios" :mode="mode" @select="i => select(slotProps.item, i)" :ref="slotProps.item.id" :scenario="slotProps.item" :cts="cts" />
			</div>

		</template>
	</list>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
