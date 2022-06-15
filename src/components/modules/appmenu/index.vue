<template>
<div id="appmenu">

    <div class="logowrapper">
        <logotype />
    </div>

    <div class="items">

        <div class="item" v-for="item in items" :key="item.id" :class="{active : item.id == active}" @click="e => open(item)">
            <i :class="item.icon" /> <span>{{ $t(item.text) }}</span>
            <div class="notifications" v-if="notifications(item.id)">{{notifications(item.id)}}</div>
        </div>

    </div>

    <div class="footer">

        <div class="help">
            <router-link to="/faq">
            <i class="far fa-question-circle"></i> <span>{{$t('caption.helpfooter')}}</span>
            </router-link>
        </div>

        <div class="themeToggleWrapper">
            <themeToggle />
        </div>

        
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
