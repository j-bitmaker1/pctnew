<template>
    <div class="campaigns_steps_list">

        <div class="add" v-if="editing">
            <div class="icon" @click="e => {addstep({})}">
                <i class="fas fa-plus-circle"></i>
            </div>
        </div>

        <div class="stepwrapper" v-for="step in steps" :key="step.id">

            <step :level="level" :refer="refer(step)" :step="step" :editing="editing" />

            <div class="add" v-if="editing">
                <div class="icon" @click="e => {addstep({step : step})}">
                    <i class="fas fa-plus-circle"></i>
                </div>
            </div>

        </div>

        <step v-if="!level" :step="{type : function(){return 'finish'}}"/>
    </div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
