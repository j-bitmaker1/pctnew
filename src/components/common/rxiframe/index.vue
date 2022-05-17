<template>
<div id="rxiframe" class="absmodal">
	<iframe ref="hiddenrxcom" class="hidden" :src="src" @load="onLoadHidden"/>

	<slot v-if="!loading">
		rx iframe here
	</slot>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
