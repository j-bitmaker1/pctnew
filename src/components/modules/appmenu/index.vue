<template>
<div id="appmenu">

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

    <div class="footer">

        <!--<div class="help">
            <router-link to="/faq">
            <i class="far fa-question-circle"></i> <span>{{$t('caption.helpfooter')}}</span>
            </router-link>
        </div>-->

        <div class="dollarsToggleWrapper">
            <dollarsToggle />
        </div>

        <div class="themeToggleWrapper">
            <themeToggle />
        </div>

        <div class="exploreWrapper" @click="explore">
            <i class="fas fa-search"></i>
        </div>
        
    </div>

    <!--<div class="copyright">
        <span>Larkspur-Rixtrema &middot; Portfolio Crash Test &middot; v{{version}}</span>
    </div>-->

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
