<template>
<div class="campaigns_step">
    
    <component v-if="component" :is="component" :step="step" :level="level" :refer="refer">
        <template v-slot:menu><smenu :step="step" :level="level"/></template>
    </component>
    <div class="empty" v-else>
        <span>Step can't be rendered</span>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
