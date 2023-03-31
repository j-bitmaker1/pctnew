<template>
<div id="optimization_settings">

	<div class="loaderWrapper" v-if="loading">
		<linepreloader />
	</div>

	<template v-if="!loading">

		<div class="formWrapper mobp">
			<forms @change="change" :compact="true" :value="gvalues" ref="general" :fields="general.schema" :grouping="general.grouping"/>
		</div>

		<div class="savePanel">
			<button class="button black" @click="cancel" v-if="wnd">
				Cancel
			</button>

			<button class="button" @click="save" >
				Save
			</button>
		</div>
	</template>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
