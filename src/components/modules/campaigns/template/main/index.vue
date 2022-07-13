<template>
<div id="campaigns_template_main">
	

	<div class="nameWrapper mobp">
		<div class="label"><span>Campaign template name</span></div>
		<div><input type="text" v-model="name"/></div>
	</div>

	<div class="caption mobp">
		<span>Campaign steps</span>
	</div>

    <div class="stepsWrapper mobp">
		<campaignsStepsList @change="change" :steps="steps" :editing="campaignTemplate.canedit()"/>
	</div>

	<div class="savePanel" v-if="campaignTemplate.canedit()">
		<button class="button black" @click="cancel" v-if="haschanges">
			Cancel
		</button>

		<button class="button" @click="e => {saveEvent()}" :disabled="!haschanges || !valid">
			Save
		</button>
	</div>

	<div class="savePanel" v-else>
		<button class="button" @click="cloneTemplate">
			Clone template
		</button>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
