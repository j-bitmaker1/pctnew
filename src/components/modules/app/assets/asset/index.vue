<template>
<div class="assets_asset">

    

    <div class="namevalue">

        <slot name="extra"></slot>

        <div class="ticker">
            <span>{{asset.ticker}}</span>
        </div>

        <div class="valueWrapper">
            <value :value="asset.value" mode="auto"/>
        </div>

    </div>

    <div class="name">
        <span>{{asset.name}}</span>
    </div>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
