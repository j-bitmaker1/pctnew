<template>
<div id="contents">
    <div class="contentsHeader">

        <div class="icon">
            <img src="img/logo-16.svg" />
        </div>

        

        <div class="panel">
            <div class="item startnewchat" @click="startnewchat"><i class="fas fa-plus-circle"></i></div>
            <div class="item closemenu"><i class="fas fa-chevron-circle-right"></i></div>

        </div>
    </div>

    <div class="historyOfrequests" v-scroll="componentscrolling">
        <history @selectchat="selectchat"/>
    </div>

    <div class="disclaimer">
        <div>
            <i class="fas fa-copyright"></i> <span>Portfolio crash test, {{new Date().getFullYear()}}</span>
        </div>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
