<template>
<div id="crashtest_main">

    <linepreloader v-if="loading"/>
    
    <template v-else>


        <div class="chartWrapper mobp">
            <chart :chartheight="height" :mobileview="mobileview" :mode="mode" :portfolios="portfolios" :info="info" :cts="cts" @scenarioClick="toScenario" @scenarioClickDirect="toScenarioDirectMany" @scenarioClickDirectOne="toScenarioDirectOne" @scenarioMouseOverDirectOne="scenarioMouseOverDirectOne"/>
        </div>

        <div class="detailsWrapper" v-if="mobileview">
            <ctdetails :mode="mode" ref="ctdetails" :info="info" :cts="cts" :portfolios="portfolios" />
        </div>


    </template>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
