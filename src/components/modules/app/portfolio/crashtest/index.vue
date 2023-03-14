<template>
<div id="portfolios_crashtest">

    <linepreloader v-if="loading" />

    <div class="ct" v-else>

        <!--<div class="summary mobp">
            <summarybutton :reversed="true" :colored="true" v-for="item in summary" :key="item.index" :text="item.text" :number="core.pct.ocr(item.index ? ct[item.index] : th[item.th])" @click="e => {item.click ? item.click() : null}" />
        </div>-->

        <div class="crsliderWrapper mobp">
            <crslider :ct="ct" :items="summary" :th="th"/>
        </div>


        <div class="header mobp">
            <div class="forpanel">
                <span>Stress test</span>
            </div>
            <div class="forsettigns">
                <ctmenu @scenariosChanged="scenariosChanged" @scoreConverterChanged="scoreConverterChanged" />
            </div>
        </div>

        <div class="subheader mobp">
            <div class="forvalue">
                <portfoliovalue :portfolio="portfolio" :value="portfolio.total() + portfolio.uncovered()" />
            </div>
            <div class="forvalues">
                <div class="positive" v-if="ct.profit"><i class="fas fa-arrow-up"></i>
                    <portfoliovalue :portfolio="portfolio" :value="portfolio.total() * ct.profit" colored="true" />
                </div>
                <div class="negative" v-if="ct.loss"><i class="fas fa-arrow-down"></i>
                    <portfoliovalue :portfolio="portfolio" :value="portfolio.total() * ct.loss"  colored="true" />
                </div>
            </div>
        </div>

        <ctmain :height="height" @scenarioMouseOver="scenarioMouseOver" :cts="cts" :mode="portfolio.isModel ? 'p100' : 'd'" :portfolios="{[portfolio.id] : portfolio}" />

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
