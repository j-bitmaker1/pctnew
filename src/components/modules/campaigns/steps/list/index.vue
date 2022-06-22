<template>
    <div class="campaigns_steps_list">
        <step :level="level" v-for="step in steps" :refer="refer(step)" :step="step" :editing="editing" :key="step.Id"/>

        <step v-if="!level" :step="{Type : 'FINISH'}"/>
    </div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
