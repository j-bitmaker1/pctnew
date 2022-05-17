<template>
<div id="share">
	<div class="sway" @click="sharelink">
		<i class="fas fa-share-alt"></i>
		<span>Share</span>
	</div>

	<div class="sway" @click="copylink">
		<i class="fas fa-link"></i>
		<span>Copy link</span>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
