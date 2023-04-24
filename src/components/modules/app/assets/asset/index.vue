<template>
<div class="assets_asset">

    

    <div class="namevalue">

        <slot name="extra"></slot>

        <div class="ticker" :uncovered="!asset.isCovered" :title="asset.isCovered || !info.name? 'Not covered' : info.name">
            <span>{{asset.ticker}}</span>
        </div>

        <div class="nameinv">
            <span v-if="/*asset.isCovered && */info.name" :title="info.name">{{info.name}}</span>
            <span v-else>Not covered</span>
        </div>

        <div class="valueWrapper">
            <portfoliovalue :includeuncovered="true" :portfolio="portfolio" :value="asset.value" :mode="mode"/>
        </div>

    </div>

    <!--<div class="name">
        <span v-if="/*asset.isCovered && */info.name">{{info.name}}</span>
        <span v-else>Not covered</span>
    </div>-->

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
