<template>
<div id="export">

    <div class="formWrapper mobp">
        <forms @change="change" :value="payload" :fields="parameters"/>
    </div>  

    <div class="preview" v-if="typeof itemsForExport != 'undefined' || loading">
        <linepreloader v-if="loading" />

        <div class="forexport" v-else>
            <span>Items for export:</span> <span class="b">{{itemsForExport}}</span>
        </div>
    </div>
    

    <div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button" @click="run" :disabled="!valid">
			Start
		</button>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
