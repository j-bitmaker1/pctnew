<template>
<div class="pages_slide">
    <div class="text mobp">
        <span>{{$t(slide.text)}}</span>
    </div>

    <div class="tip mobp" v-if="slide.tip">
        <span>{{$t(slide.tip)}}</span>
    </div>
    <div class="savePanel">
        <button class="button black" v-if="typeof slide.back == 'undefined' || slide.back" @click="back">
            Back
        </button>
        <button class="button"  v-if="typeof slide.next == 'undefined' || slide.next" @click="next" :disabled="!cannext">
            Next
        </button>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
