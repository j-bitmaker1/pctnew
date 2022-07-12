<template>
<div id="topmenu" :class="path">
    <div class="logowrapper">
        <router-link to="/">
            <logotype />
        </router-link>
    </div>

    <div class="profilewrapper" v-if="auth && userinfo">
        <router-link to="/profile">
            <userpic :userinfo="userinfo"/>
        </router-link>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
