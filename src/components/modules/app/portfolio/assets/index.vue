<template>
<div id="portfolio_assets">

    <div class="controls mobp">

        <div class="forcaption">
            <span>Assets</span>
        </div>

        <div class="foredit">
            <div class="diconbutton">
                <i class="fas fa-list" @click="edit"></i>
            </div>
        </div>
    </div>

    <div class="assetsWrapper">
        <assets :assets="assets" />
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
