<template>
<div id="portfolio_assets_difference">
    <div class="group" v-for="i in indexes" :key="i" v-if="cgroupped[i].length">
        <div class="groupcaption">
            <span>{{$t('optimization.gr.' + i)}}</span>
        </div>

        <div class="content">
            <div class="asset" v-for="asset in cgroupped[i]">
                <div class="ticker" :uncovered="!asset.isCovered">
                    <span>{{asset.ticker}}</span>
                </div>

                <div class="nameinv">
                    <span v-if="/*asset.isCovered && */asset.name" :title="asset.name">{{asset.name}}</span>
                    <span v-else>Not covered</span>
                </div>

                <div class="valueWrapper prev" v-if="asset.prevvalue != asset.curvalue">
                    <portfoliovalue :includeuncovered="true" :portfolio="portfolio" :value="asset.prevvalue" :mode="portfolio.isModel ? 'p100' : 'd'"/>
                </div>

                <div class="valueWrapper">
                    <portfoliovalue :includeuncovered="true" :portfolio="portfolio" :value="asset.curvalue" :mode="portfolio.isModel ? 'p100' : 'd'"/>
                </div>

                
            </div>
        </div>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
