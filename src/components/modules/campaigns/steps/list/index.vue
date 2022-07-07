<template>
    <div class="campaigns_steps_list">

        <step v-if="!level" :step="{type : function(){return 'start'}}"/>

        <div class="add main" v-if="editing" @click="e => {addstep({})}">
            <div class="icon" >
                <i class="fas fa-plus-circle"></i>
            </div>
            <div class="label"><span>Add step</span></div>
        </div>

        <div class="stepwrapper" v-for="step in steps" :key="step.id">

            <step @editStep="e => editStep(step)" @removeStep="e => removeStep(step)" @change="changeStep" :level="level" :refer="refer(step)" :step="step" :editing="editing" />

            <div class="add" v-if="editing">
                <div class="icon" @click="e => {addstep({after : step})}">
                    <i class="fas fa-plus-circle"></i>
                </div>
            </div>

        </div>

        <step v-if="!level" :step="{type : function(){return 'finish'}}"/>
    </div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
