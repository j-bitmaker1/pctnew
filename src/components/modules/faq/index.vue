<template>
<div id="faq">

    <!--<div class="tosupport mobp">
        <router-link to="/support">
            <button class="button">Support</button>
        </router-link>
    </div>-->

    <div class="q mobp" v-for="item in faq">
        <div class="caption">
            <span>{{item.caption}}</span>
        </div>

        <div class="text">
            <span>{{item.text}}</span>
        </div>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
