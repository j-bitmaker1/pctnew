<template>
<div id="topmenu" :class="path">
    <div class="logowrapper" @click="gotohome">
        
        <logotype />
        
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
