<template>
<div id="summary_portfoliocaption">
    <div class="captionsl" v-if="portfolio">

        <div class="clientinfo" v-if="profile" @click="openclient">
            <client :profile="profile"  :small="true"/>
        </div>
        
        <div class="divider" v-if="profile">
            <span>/</span>
        </div>

        <div class="portfolioname" @click="clickPortfolio">
            <span>{{portfolio.name}}</span>
        </div>
        <div class="divider">
            <span>&middot;</span>
        </div>

        <div class="forvalue">
            <value :value="portfolio.total() + portfolio.uncovered()" :mode="portfolio.isModel ? 'p100' : 'd'" />
        </div>

        <portfolioAdvisorFee :portfolio="portfolio" v-if="portfolio.advisorFee"/>

    </div>

    <!--<div class="portfolioMenu" v-if="portfolio">
        <portfoliomenu :ext="true" buttonclass="diconbutton" @changeClient="changeClient" @edit="editportfolio" @delete="deleteportfolio" :portfolio="portfolio" />
    </div>-->
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
