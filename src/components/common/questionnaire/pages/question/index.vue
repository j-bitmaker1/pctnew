<template>
<div class="pages_question">
    <div class="question mobp">
        <span>{{$t(question.question)}}</span>
    </div>

    <div class="tip mobp" v-if="question.tip">
        <span>{{$t(question.tip)}}</span>
    </div>

    <div class="form mobp" v-if="question.form">
        <forms @input="input" :value="qvalues" ref="fields" :fields="question.form.schema"/>
    </div>

    <div class="savePanel">
		<button class="button black" @click="back">
            Back
		</button>
		<button class="button" v-if="typeof question.next == 'undefined' || question.next" @click="next" :disabled="!cannext">
			Next
		</button>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
