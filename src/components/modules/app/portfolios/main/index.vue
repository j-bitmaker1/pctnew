<template>
<div id="portfolios_main">
    <div class="fs mobp">
        <div class="filesystemwrapper">
            <filesystem :initialroot="0" :select="select" @selectFile="selectedFile"/>
        </div>
    </div>

    <portfoliolist @selected="selected" :additional="additional" :select="select"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
