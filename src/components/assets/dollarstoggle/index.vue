<template>
<div id="themeToggle">

    <div class="tgl" @click="seta">
        <div>
            <i class="fas fa-dollar-sign" :class="{active : dollars == 'd'}"></i>
            <i class="fas fa-percent" :class="{active : dollars == 'p'}"></i>
        </div>
    </div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
