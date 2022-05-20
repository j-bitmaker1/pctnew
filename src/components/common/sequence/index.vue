<template>
<div class="sequence" ref="sequence" :class="direction">
     <list ref="list" :items="pages">
        <template v-slot:default="slotProps">
            <div class="pageWrapper" :ref="slotProps.item.id">
                <slot v-bind:item="slotProps.item">
                </slot>
            </div>
        </template>
    </list>
</div>
</template>

<script src="./index.js"></script>

<style lang="sass" scoped src="./index.sass"></style>
