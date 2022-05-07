<template>
<div id="rx-profile">
    <div class="cardWrapper">
        <card :userinfo="userinfo" />
    </div>

    <div class="infoWrapper">Additional Info</div>

    <div class="actions">
        <div class="action">
            <router-link to="/changepassword">
                <button class="button">Change Password</button>
            </router-link>
        </div>
    </div>

    <div class="signout" @click="signout">
        <span>{{ $t("common.2901049") }}</span>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
