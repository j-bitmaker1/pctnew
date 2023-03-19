<template>
<div class="filemanager_asset">

    <div class="data">
        <div class="tickers">

            <div class="searchticker">
                <i class="fas fa-search" @click="searchAssets"></i>
            </div>

            <div class="ticker">
                <span>{{asset.Ticker}}</span>
            </div>
            
        </div>

        <div class="name" v-if="asset.Name">
            <span>{{asset.Name}}</span>
        </div>

        <div class="oldname" v-else>
            <span>{{asset.FullTextInOriginalFile}}</span>
        </div>

        <div class="value">
            <input type="text" :value="asset.Value" @change="e => changeValue(e.target.value)"/>
        </div>
        
    </div>

    <div class="panel">

        <div class="buttonpanel">
            <i class="fas fa-times" @click="remove"></i>
        </div>
        
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
