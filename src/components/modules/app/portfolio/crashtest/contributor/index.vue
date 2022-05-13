<template>
<div class="portfolio_crashtest_contributor">

    

    <div class="header topheader">
        <div class="ticker">
            AAAAX US
        </div>
        <div class="value">
            <value :value="contributor.value" mode="auto"/>
        </div>
    </div>

    <div class="header">
        <div class="name">
            <span>{{contributor.name}}</span>
        </div>
        
    </div>
    <div class="lineWrapper">
        <div class="line">
            <div class="fill" :style="{width : width + '%', background:color}">
            </div>
        </div>
    </div>
   
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
