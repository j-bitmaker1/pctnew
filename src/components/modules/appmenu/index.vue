<template>
<div id="appmenu" :class="{footerFocused}">

    <!--<div class="logowrapper">
        <logotype />
    </div>-->

    <div class="items">

        <div class="item unselectable" v-for="item in items" :key="item.id" :class="{active : item.id == active}" @click="e => open(item)">
            <i :class="item.icon" /> <span class="label">{{ $t(item.text) }}</span>
            <div class="notifications" v-if="notifications(item.id)">
                <template v-if="notifications(item.id) <= 99">{{notifications(item.id)}}</template>
                <template v-else>!</template>
            </div>
        </div>

    </div>

    <div class="footer" @mouseover="mouseoverFooter" @mouseleave="mouseleaveFooter">

       

        <div class="dollarsToggleWrapper">
            <dollarsToggle />
        </div>

        <div class="themeToggleWrapper">
            <themeToggle />
        </div>

        <div class="exploreWrapper" @click="explore">
            <i class="fas fa-search"></i>
        </div>

        <div class="aiWrapper" @click="openai" v-if="aifeature && !summaryview">
            <img :src="require('@/assets/logoai.svg')" />
        </div>
        
    </div>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
