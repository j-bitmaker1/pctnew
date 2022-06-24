<template>
<div class="campaign_step_whilestep" :class="this.step.status">

    <smeta :step="step" :editing="editing">
        <template v-slot:icon><i class="fas fa-clock"></i></template>

        <template v-slot:content>
            <div>
                <div class="caption">
                    <span>Wait until a condition is met or a time limit expires</span>
                </div>
                <linepreloader v-if="loading"/>
                <div class="time" v-if="!loading && template">
                    <span>Wait {{duration}}</span> <b>or</b> <span >until <b>&ldquo;{{template.Name}}&rdquo;</b> has been read</span>
                </div>

            </div>
        </template>

        <template v-slot:menu>
            <slot name="menu"></slot>
        </template>

    </smeta>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
