<template>
<div class="list" :class="{selection, selectMultiple}">

    <div class="selectionControls mobp" v-if="selection">
        <div class="caption">
            <span>Select elements from list</span>
        </div>
        <div class="controls">

            <button class="button" v-if="selectionLength" @click="selectionSuccess">Select ({{selectionLength}})</button>
            <button class="button black" @click="selectionCancel">Cancel</button>
            
        </div>
    </div>

    <transition-group v-if="elheight" name="staggered-fade" tag="div" :css="false" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave">

        <div class="item" v-touch:longtap="e => enterSelectionMode(i)" :key="item.id || item.ID || (i + 1)" :data-index="i" v-for="(item, i) in readyItems" @click="e => click(item)">
            
            <div class="selectionmarker" v-if="selection" @click="select(i)">
                <i class="fas fa-circle" v-if="!selection[i]"></i>
                <i class="fas fa-check-circle" v-else></i>
            </div>
            
            <slot :item="item" :index="i">
                {{ item.value }}
            </slot>
        </div>

    </transition-group>

	<div v-else>
		<div class="item" v-touch:longtap="e => enterSelectionMode(i)" :key="item.id || item.ID || (i + 1)" :data-index="i" v-for="(item, i) in readyItems" @click="e => click(item)">

            <div class="selectionmarker" v-if="selection" @click="select(i)">
                <i class="fas fa-circle" v-if="!selection[i]"></i>
                <i class="fas fa-check-circle" v-else></i>
            </div>

            <slot :item="item" :index="i">
                {{ item.value }}
            </slot>
        </div>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>

<!-- THEMES BEGIN -->
<!-- THEMES END -->
