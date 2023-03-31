<template>
<div id="portfolios_crashtest">

    <div class="ct">

        <div class="header mobp">
            <div class="forpanel">
                <span>Stress test</span>
            </div>
            <div class="forsettigns">
                <ctmenu :cts="cts" :portfolios="portfolios" @scenariosChanged="scenariosChanged" @scoreConverterChanged="scoreConverterChanged"/>
            </div>
        </div>

        <div class="subheader mobp" v-if="portfolio">
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

        <totalchart 
            @scenarioMouseOver="scenarioMouseOver" 
            :height="optimizedPortfolio ? 0 : height" 
            :mode="portfolio.isModel ? 'p100' : 'd'" 
            :portfolios="portfolios"
            :cts="cts"
            :cpmdata="cpmdata"
            :optimize="portfolio.id"
            @optimized="optimized"
            :optimizedPortfolio="optimizedPortfolio"
        />

        <div class="optimizedPortfolioPanel" v-if="optimizedPortfolio">
            <button class="button small black" @click="cancelOptimization">Cancel optimization</button>
            <button class="button small" @click="saveOptimization">Save</button>
        </div>

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
