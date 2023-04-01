<template>
<div class="assets_edit">

    

    <div class="assets_inputs" :class="{focused}">

        <div class="tickerwrapper" v-if="ticker">
            <div class="ticker" :uncovered="!isCovered">
                <span>{{ticker}}</span>
            </div>
        </div>

        <div class="name">
            <input ref="nameinput" type="text" @focus="focus" @blur="blur" :value="focused ? namestring : (namestring || name)" @keyup="namechange" :placeholder="name ? name : ticker && !isCovered ? 'Not covered' : 'Enter asset name or ticker'" />
        </div>

        <div class="value" v-if="!withoutvalue">
            <input :disabled="!ticker" :value="value ? value : ''" ref="valueinput" type="number" placeholder="0" @change="changevalue" @keyup.enter="enterOnSum"/>
        </div>

        <div class="difference liketicker" v-if="showdif">
            <value :value='difference || 0'/>
        </div>

        <div class="pdicon" v-if="!withoutvalue">
            <span v-if="mode == 'd'">$</span>
            <span v-if="mode == 'p'">%</span>
        </div>

    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
