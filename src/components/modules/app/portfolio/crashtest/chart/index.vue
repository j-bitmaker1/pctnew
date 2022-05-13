<template>
<div class="portfolio_crashtest_chart">

    <div class="scale">
        <div class="num" v-for="index in intervals" :key="index">
            <div><value :value="num(index)" mode="auto"/></div>
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
