<template>
<div id="clientsedit">
	<div class="fields">
		<forms :value="values" ref="fields" :fields="schema.fields"/>
	</div>

	<div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>
		<button class="button" @click="save" :disabled="!haschanges">
			Save
		</button>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
