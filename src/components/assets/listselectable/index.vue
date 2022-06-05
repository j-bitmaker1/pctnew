<template>
<div class="listselectable" :class="[selection ? 'selection' : '', view]">
    <list :transition="transition" ref="list" :items="items" @click="click" @touchhold="touchhold">
        <template v-slot:default="slotProps">

            <div class="selectionmarker" v-if="selection && (!filter || filter(slotProps.item))" @click="select(slotProps.item || slotProps.item)">
                <i class="fas fa-circle" v-if="!selection[slotProps.item.id || slotProps.item.ID]"></i>
                <i class="fas fa-check-circle" v-else></i>
            </div>

            <slot v-bind:item="slotProps.item">
            </slot>
        </template>
    </list>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
