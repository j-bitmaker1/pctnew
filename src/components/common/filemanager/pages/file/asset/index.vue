<template>
<div class="filemanager_asset">

    <div class="data">
        <div class="tickers">
            <div class="ticker">
                <span>{{asset.Ticker}}</span>
            </div>

            <div class="searchticker">
                <i class="fas fa-search" @click="searchAssets"></i>
            </div>
        </div>

        <div class="value">
            <input type="text" :value="asset.Value" @change="e => changeValue(e.target.value)"/>
        </div>

        <div class="name">
            <span>{{asset.Name}}</span>
        </div>

        <div class="oldname">
            <span>{{asset.FullTextInOriginalFile}}</span>
        </div>
        
    </div>

    <div class="panel">

        <div class="buttonpanel">
            <i class="fas fa-times"></i>
        </div>
        
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
