<template>
<div class="portfolios_shares">

    <linenavigation :items="navigation" :navdefault="navdefault" :buttons="true" :navkey="navkey"/>

    <component :is="module"/>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
