<template>
<div id="campaigns_template_main">

	<div class="nameWrapper">
		<label>Email name</label>
		<input type="text" v-model="name"/>
	</div>

	<div class="subjectWrapper">
		<label>Email subject</label>
		<input ref="subject" type="text" v-model="subject" @keyup="keyupSubject"/>
	</div>

    <div class="editorWrapper">
		<htmleditor ref="htmleditor" @keyup="keyupEditor" v-model="body"/>
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
