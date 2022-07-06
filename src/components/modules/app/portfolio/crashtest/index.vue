<template>
<div id="portfolios_crashtest">

    <linepreloader v-if="loading" />

    <div class="ct" v-else>

        <div class="summary mobp">
            <summarybutton :reversed="true" :colored="true" v-for="item in summary" :key="item.index" :text="item.text" :number="core.pct.ocr(item.index ? ct[item.index] : th[item.th])" @click="e => {item.click ? item.click() : null}" />
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
                <value :value="portfolio.total() + portfolio.uncovered()" :mode="portfolio.isModel ? 'p100' : 'd'" />
            </div>
            <div class="forvalues">
                <div class="positive" v-if="ct.profit"><i class="fas fa-arrow-up"></i>
                    <value :value="portfolio.total() * ct.profit" :mode="portfolio.isModel ? 'p100' : 'd'" colored="true" />
                </div>
                <div class="negative" v-if="ct.loss"><i class="fas fa-arrow-down"></i>
                    <value :value="portfolio.total() * ct.loss" :mode="portfolio.isModel ? 'p100' : 'd'" colored="true" />
                </div>
            </div>
        </div>

        <ctmain :cts="cts" :mode="portfolio.isModel ? 'p100' : 'd'" :portfolios="{[portfolio.id] : portfolio}" />

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
