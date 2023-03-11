<template>
<div id="themeToggle">

    <div class="tgl">
        <div>
            <i class="fas fa-dollar-sign" :class="{active : dollars == 'd'}" @click="set('d')"></i>
            <i class="fas fa-percent" :class="{active : dollars == 'p'}" @click="set('p')"></i>
        </div>
    </div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
