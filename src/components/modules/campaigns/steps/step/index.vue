<template>
<div class="campaigns_step">
    
    <component @change="change" v-if="component" :editing="editing" :is="component" :step="step" :level="level" :refer="refer">
        <template v-slot:menu><smenu :step="step" :level="level" @edit="edit" @remove="remove"/></template>
    </component>

    <div class="empty" v-else>
        <span @click="remove">Step can't be rendered</span>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
