<template>
<div id="crashtest_totalchart">


    <div class="crsliderWrapper mobp" v-if="portfolios && cts">
        <crslider :cts="cts" :portfolios="portfolios" :cpmdata="cpmdata" :optimize="optimize" @optimization="optimization" :currentOptimization="currentOptimization" />
    </div>

   
    <ctmain v-if="portfolios && cts" :cts="cts" :portfolios="portfolios" :currentOptimization="currentOptimization" :optimize="optimize" :mode="mode" :height="height" @scenarioMouseOver="scenarioMouseOver" @optimization="optimization"/>

    <template v-if="doingoptimization || _.isEmpty(portfolios) || _.isEmpty(cts)">
        <div class="loaderWrapper">
            <linepreloader />
        </div>
    </template>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
