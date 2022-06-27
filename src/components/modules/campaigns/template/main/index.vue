<template>
<div id="campaigns_template_main">

	<div class="nameWrapper">
		<input type="text" v-model="name"/>
	</div>

    <div class="stepsWrapper mobp">
		<campaignsStepsList @change="change" :steps="steps" :editing="true"/>
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
