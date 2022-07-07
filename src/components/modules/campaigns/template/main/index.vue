<template>
<div id="campaigns_template_main">
	

	<div class="nameWrapper mobp">
		<label>Campaign template name</label>
		<input type="text" v-model="name"/>
	</div>

	<div class="caption mobp">
		<span>Campaign steps</span>
	</div>

    <div class="stepsWrapper mobp">
		<campaignsStepsList @change="change" :steps="steps" :editing="true"/>
	</div>

	<div class="savePanel">
		<button class="button black" @click="cancel" v-if="haschanges">
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
