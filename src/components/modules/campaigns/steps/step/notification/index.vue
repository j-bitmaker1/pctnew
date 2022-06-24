<template>
<div class="campaign_step_notify">

    <smeta :step="step" :editing="editing">
        <template v-slot:icon><i class="fas fa-bell"></i></template>

        <template v-slot:content>
            <div>
                <div class="caption">
                    <span>Notification</span>
                </div>
                <div class="message">
                    <span>{{step.notification}}</span>
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
