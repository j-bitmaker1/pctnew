<template>
<div id="signature_main">

	<div class="nameWrapper">
		<label>Signature name</label>
		<input type="text" v-model="name"/>
	</div>

    <div class="editorWrapper">
		<htmleditor v-model="body"/>
	</div>

	<div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button" @click="save" :disabled="!haschanges || !valid">
			Save
		</button>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
