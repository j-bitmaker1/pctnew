<template>
<div id="portfolios_crashtest">
    <linepreloader v-if="loading"/>

    <div class="ct" v-else>

        <chart :ct="ct"/>

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
