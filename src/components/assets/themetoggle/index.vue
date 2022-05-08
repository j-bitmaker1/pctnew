<template>
<div id="themeToggle">

    <div>
        <i class="fas fa-sun" :class="{active : theme == 'white'}" @click="set('white')"></i>
        <i class="fas fa-moon" :class="{active : theme == 'black'}" @click="set('black')"></i>
    </div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
