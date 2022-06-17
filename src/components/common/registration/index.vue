<template>
<div id="registration">
    <div class="caption mobp">
        <span>Create account and get PCT trial!</span>
    </div>

    <div class="stickerwrapper">
        <sticker src="brainstorming.png"/>
    </div>

    <div class="formswrapper mobp">
        <forms @input="input" :value="values || {}" ref="fields" :fields="fields"/>
    </div>

    <div class="savePanel">
		
		<button class="button" @click="save">
			Register and get trial
		</button>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
