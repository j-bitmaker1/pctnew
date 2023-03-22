<template>
<div id="comparewith_retrospective">

    <linepreloader v-if="loading"/>

    <div class="ctwrapper" v-else>
            <retrospective :portfolios="portfolios"/>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
