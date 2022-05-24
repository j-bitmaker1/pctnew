<template>
<div class="portfolio_crashtest_details">.

	<list :items="ct.scenarios || []" @click="select">
		<template v-slot:default="slotProps">

			<div class="scenarioWrapper" :class="{lighted : lighted == slotProps.item.id}">
				<scenario :ref="slotProps.item.id" :scenario="slotProps.item" :ct="ct" :maxabs="maxabs" />
			</div>

		</template>
	</list>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
