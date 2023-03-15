<template>
<div class="assets_edit">

    

    <div class="assets_inputs" :class="{focused}">

        <div class="tickerwrapper">
            <div class="ticker" v-if="ticker" :uncovered="!isCovered">
                <span>{{ticker}}</span>
            </div>
        </div>

        <div class="name">
            <input ref="nameinput" type="text" @focus="focus" @blur="blur" :value="focused ? namestring : (namestring || name)" @keyup="namechange" :placeholder="ticker && !isCovered ? 'Not covered' : 'Enter asset name or ticker'" />
        </div>

        

        <div class="value">
            <!--<money :disabled="!ticker" :value="value ? value : ''" ref="valueinput"  placeholder="0" @change="changevalue" @keyup.enter="enterOnSum"></money>-->

            <input :disabled="!ticker" :value="value ? value : ''" ref="valueinput" type="number" placeholder="0" @change="changevalue" @keyup.enter="enterOnSum"/>
        </div>
        <div class="pdicon">
            <span v-if="mode == 'd'">$</span>
            <span v-if="mode == 'p'">%</span>
        </div>

    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
