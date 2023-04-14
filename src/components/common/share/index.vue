<template>
<div id="share">
	<div class="ways">
		<div class="sway" @click="sharelink" v-if="cordova">
			<i class="fas fa-share-alt"></i>
			<span>Share</span>
		</div>

		<div class="sway" @click="copylink" v-if="url">
			<i class="fas fa-link"></i>
			<span>Copy link</span>
		</div>

		<div class="sway" @click="download" v-if="files && files.length">
			<i class="fas fa-file-download"></i>
			<span>Download</span>
		</div>
	</div>

	<div class="settings" v-if="settings">
		<forms @change="changesettings" :value="values" ref="fields" :fields="settings.schema"/>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
