<template>
<div id="themeToggle">

    <div class="tgl">
        <div>
            <i class="fas fa-sun" :class="{active : theme == 'white'}" @click="set('white')"></i>
            <i class="fas fa-moon" :class="{active : theme == 'black'}" @click="set('black')"></i>
        </div>
    </div>

    <div class="label">
        <span>{{$t('themes.' + theme)}}</span>
    </div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
