<template>
<div class="portfolios_crashtest_details">
    <div class="scenarioWrapper" v-for="scenario in ct.scenarios">
        <scenario :scenario="scenario" :ct="ct" :maxabs="maxabs">
            
        </scenario>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
