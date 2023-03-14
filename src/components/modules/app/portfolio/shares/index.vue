<template>
<div class="portfolios_shares ">

	<div class="navwrapper">
		<linenavigation :items="navigation" :navdefault="navdefault" :buttons="true" :second="true" :navkey="navkey" />
	</div>

	<linepreloader v-if="loading" />

	<component v-else @editportfolio="editportfolio" :updclbk="updclbk" :is="module" :edit="assetsedit" :assets="assets" :assetsinfo="assetsinfo" :portfolio="portfolio"/>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
