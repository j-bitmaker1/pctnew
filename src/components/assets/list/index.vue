<template>
<div class="list">
    <transition-group v-if="elheight" name="staggered-fade" tag="div" :css="false" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave">

        <div class="item" :key="item.id || item.ID" :data-index="i" v-for="(item, i) in readyItems" @click="e => click(item)">
            <slot :item="item">
                {{ item.value }}
            </slot>
        </div>

    </transition-group>

	<div v-else>
		<div class="item" :key="item.id || item.ID" :data-index="i" v-for="(item, i) in readyItems">
            <slot :item="item">
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
