<template>
<div id="crashtest_main">

    <linepreloader v-if="loading"/>
    
    <template v-else>


        <div class="chartWrapper mobp">
            <chart :mobileview="mobileview" :mode="mode" :info="info" :cts="cts" @scenarioClick="toScenario" @scenarioClickDirect="toScenarioDirectMany" @scenarioClickDirectOne="toScenarioDirectOne"/>
        </div>

        <div class="detailsWrapper" v-if="mobileview">
            <ctdetails :mode="mode" ref="ctdetails" :info="info" :cts="cts" :portfolios="portfolios" />
        </div>


    </template>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
