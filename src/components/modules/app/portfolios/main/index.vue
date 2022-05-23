<template>
<div id="portfolios_main">


	<div key="filesystem" class="fs mobp partwr" >
		<div class="filesystemwrapper">
			<filesystem ref="filesystem" :initialroot="0" :select="select" @selected="selected" @selectionChange="v => selectionChange('filesystem', v)" @selectionCancel="v => selectionCancel('filesystem', v)"/>
		</div>

		<div class="poi" v-if="currentSelection == 'list'">
		</div>
	</div>
	
	<div class="portfolioListWrapper partwr">
		<portfoliolist key="list" :showClient="true" ref="list" @selected="selected" @selectionChange="v => selectionChange('list', v)" @selectionCancel="v => selectionCancel('list', v)" :additional="additional" :select="select"/>

		<div class="poi" v-if="currentSelection == 'filesystem'">
		</div>
	</div>



</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
