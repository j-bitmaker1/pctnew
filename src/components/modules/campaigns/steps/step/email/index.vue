<template>
<div class="campaign_step_email">

    <smeta :step="step" :editing="editing">
        <template v-slot:icon>
            <i class="fas fa-envelope-open" v-if="step.OPENED"></i>
            <i class="fas fa-envelope"></i>
        </template>

        <template v-slot:content>

            <linepreloader v-if="loading"/>
            <div v-else>
                <div class="template" v-if="template">
                    <div class="name"><span>{{template.Name}}</span></div>
                    <div class="subject"><span>{{template.Subject}}</span></div>
                </div>

                <div v-else class="empty">
                    <span>Email template hasn't loaded</span>
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
