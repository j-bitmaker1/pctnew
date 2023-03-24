<template>
<div id="optimization_settings">
    <div class="formWrapper mobp">
        <forms :compact="true" :value="gvalues" ref="general" :fields="general.schema" :grouping="general.grouping"/>
    </div>

    <div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button" @click="save" >
			Save
		</button>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
