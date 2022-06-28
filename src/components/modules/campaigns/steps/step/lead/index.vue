<template>
<div class="campaign_step_notify">

    <smeta :step="step" :editing="editing">
        <template v-slot:icon><i class="fas fa-user-plus"></i></template>

        <template v-slot:content>
            <div>
                <div class="caption">
                    <span>Add lead</span>
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
