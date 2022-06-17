<template>
<div id="factoranalysis">
    <div class="header mobp">
        <div class="caption">
            <span>Factor analysis</span>
        </div>

        <!--<div class="panel">
            <button class="button small black" @click="selectfactors">Select factors</button>
        </div>-->
    </div>

    <div class="analysis">
        <fmap :portfolio="portfolio" :factors="factors" @changeFactor="changeFactor"/>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
