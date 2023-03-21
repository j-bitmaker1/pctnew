<template>
<div id="comparewith_portfolioinfo">

    <div class="name mobp"><span>{{portfolio.name}}</span> &middot; <value :mode="portfolio.isModel ? 'p100' : 'd'" :value="portfolio.total()"/></div>



    <infotable :showzero="true" type="portfolio" :data="portfolioData" :fields="fields"/>
   
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
