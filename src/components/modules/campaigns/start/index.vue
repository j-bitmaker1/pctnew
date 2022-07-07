<template>
<div id="campaigns_start">
    <div class="campaignTemplate mobp">
        <div class="caption">
            <span>Select campaign template</span>
        </div>

        <div class="selected" v-if="template">
            <preview :template="template"  :showMenu="false"/>
        </div>

        <div class="buttonWrapper">
            <button class="button" :class="{black : template}" @click="selecttemplate">Select</button>
        </div>
    </div>


    <div class="contacts mobp" v-if="template">
        <div class="caption">
            <span>Select recipients</span>
        </div>

       <div class="buttonWrapper">
            <button class="button" @click="selectcontacts">Select</button>
        </div>
    </div>


    <div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button" @click="start" :disabled="!valid">
			Start
		</button>
	</div>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
