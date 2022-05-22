<template>
<div id="portfolios_main">

	<transition-group name="fadelist" tag="div">

		<div key="filesystem" class="fs mobp" v-if="!currentSelection || currentSelection == 'filesystem'">
			<div class="filesystemwrapper">
				<filesystem :fclass="!currentSelection ? 'mini' : 'expanded'" ref="filesystem" :initialroot="0" :select="select" @selected="selected" @selectionChange="v => selectionChange('filesystem', v)" @selectionCancel="v => selectionCancel('filesystem', v)"/>
			</div>
		</div>
		

		<portfoliolist key="list" v-if="!currentSelection || currentSelection == 'list'" :showClient="true" ref="list" @selected="selected" @selectionChange="v => selectionChange('list', v)" @selectionCancel="v => selectionCancel('list', v)" :additional="additional" :select="select"/>

	</transition-group>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
