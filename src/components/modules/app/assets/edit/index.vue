<template>
<div class="assets_edit">

    <div class="ticker" v-if="ticker" :uncovered="!isCovered">
        <span>{{ticker}}</span>
    </div>

    <div class="assets_inputs">

        <div class="name">
            <input ref="nameinput" @focus="focus" @blur="blur" :value="focused ? namestring : (namestring || name)" @keyup="namechange" :placeholder="ticker && !isCovered ? 'Not covered' : 'Enter asset name or ticker'" />
        </div>

        <div class="value">
            <input :disabled="!ticker" :value="value ? value : ''" ref="valueinput" placeholder="0" @change="changevalue" />
        </div>

    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
