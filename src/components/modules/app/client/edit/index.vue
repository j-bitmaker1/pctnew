<template>
<div id="clientsedit">
	<div class="fields general">
		<div class="caption">
			<span>General Information</span>
		</div>
		<forms :value="general" @change="changeGeneral" ref="general" :fields="generalFields"/>
	</div>

	<div class="fields additional">
		<div class="caption">
			<span>Additional Information</span>
		</div>
		<forms :value="additional" @change="changeAdditional" ref="additional" :fields="additionalFields"/>
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
