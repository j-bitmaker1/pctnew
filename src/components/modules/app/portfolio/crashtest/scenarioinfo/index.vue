<template>
<div class="portfolio_crashtest_scenarioinfo">
        
    <div class="shocks mobp infopt" v-if="info.shocks">
        <div class="caption">
            <span>Description</span>
        </div>

        <div class="shortDescription">
            
            <div>{{info.shocks}}</div>
        </div>
    </div>

    <div class="shocks mobp infopt" v-if="info.description">

        <div class="caption">
            <span>Event duration</span>
        </div>

        <div class="shortDescription">
            {{info.description}}
        </div>
    </div>

    <div class="keywords mobp infopt">

        <span class="liketicker">{{info.region}}</span> <tags :tags="info.keywords"/>
     
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
