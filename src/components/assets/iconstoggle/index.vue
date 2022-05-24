<template>
<div class="iconstoggle">

    <div>
        <i v-for="icon in icons" :key="icon.id" :class="[icon.icon, icon.good ? 'good' : '']" :active="value == icon.id" @click="change(icon.id)"/>
    </div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
