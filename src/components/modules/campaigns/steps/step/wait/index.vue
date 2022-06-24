<template>
<div class="campaign_step_wait" :class="this.step.status">

    <smeta :step="step" :editing="editing">
        <template v-slot:icon><i class="fas fa-clock"></i></template>

        <template v-slot:content>
            <div>
                <div class="caption">
                    <span>Wait</span>
                </div>
                <div class="time">
                    <span>{{duration}}</span>
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
