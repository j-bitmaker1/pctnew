<template>
    <div id="home_search">
        <div class="searchWrapper mobp">
            <search @search="search" :value="searchvalue"/>
        </div>

        <div class="activityWrapper">
            <activity :mixgroup="fromsearch" :searchvalue="searchvalue" @close="close"/>
        </div>
    </div>  
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
