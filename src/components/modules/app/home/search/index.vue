<template>
    <div id="home_search">
        <div class="searchWrapper mobp">
            <search activity="everywhere" @search="search" :value="searchvalue" :loading="loading"/>
        </div>

        <div class="activityWrapper">
            <activity ref="activity" @search="search" :mixgroup="mix" :loading="loading" :searchvalue="searchvalue" @close="close"/>
        </div>
    </div>  
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
