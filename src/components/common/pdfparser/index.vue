<template>
<div id="pdfparser" class="absmodal">
	<rxiframe>
		<template v-slot:default>
			<iframe :src="src" width="100%" height="100%" @load="onLoad"/>
		</template>
	</rxiframe>
	
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
