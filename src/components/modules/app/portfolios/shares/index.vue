<template>
<div class="portfolios_shares mobp">

    <linenavigation :items="navigation" :navdefault="navdefault" :buttons="true" :navkey="navkey"/>
    
    <linepreloader v-if="loading"/>

    <component v-else :is="module" :assets="assets"/>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
