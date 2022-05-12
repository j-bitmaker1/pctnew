<template>
<div id="home">
    <div class="buttonsWrapper mobp">
        <router-link to="/clients">
            <bigmainbutton icon="fas fa-users" :label="$t('menu.clients')" blabel="55" :active="true" nlabel="+4" />
        </router-link>
        <router-link to="/leads">
            <bigmainbutton icon="fas fa-user-plus" :label="$t('menu.leads')" blabel="1255" nlabel="+4" />
        </router-link>
    </div>

    <div class="notificationsWrapper">
        <div class="caption mobp">
            <span>Watch List</span>
        </div>
        <notifications />
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
