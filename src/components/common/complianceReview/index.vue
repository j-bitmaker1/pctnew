<template>
<div id="complianceReview">
    <div class="inputemailWrapper">
        <input v-model="email" type="text" placeholder="Enter an email"/>
    </div>
    <div class="textareaWrapper">
        <textarea disabled placeholder="Compliance data">{{text}}</textarea>
    </div>

    <div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>
		<button class="button" @click="send" :disabled="emailfail">
			Send
		</button>
	</div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
