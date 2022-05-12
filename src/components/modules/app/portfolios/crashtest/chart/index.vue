<template>
<div class="portfolios_crashtest_chart">

    <div class="scale">
        <div class="num" v-for="index in intervals">
            <div>{{num(index)}}</div>
        </div>
    </div>

    <div class="background">
    </div>

    <div class="scenarios">
        <div class="scenario" v-for="scenario in ct.scenarios">
            <div class="bar" :style="{height : height(scenario) + '%', background : color(scenario) }"></div>
        </div>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
