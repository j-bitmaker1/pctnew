<template>
<div id="fastmenu" @click="close">
    <div class="items">
        <transition-group name="menu" tag="div">
            <div class="item" v-for="item in items" :key="item.id" @click="e => open(item)">
                <div><i :class="item.icon" /></div>
                <div class="label"><span>{{ $t(item.text) }}</span></div>
            </div>
        </transition-group>

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
