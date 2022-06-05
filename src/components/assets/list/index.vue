<template>
<div class="list">

    <div class="simplelist" ref="simplelist">
        <transition-group :name="transition" tag="div">
            <div class="item" v-touch:touchhold="e => touchhold(item)" :key="item.id || item.ID || (i + 1)" :data-index="i" v-for="(item, i) in readyItems" @click="e => click(item)">
                <slot :item="item" :index="i">
                    {{ item.value }}
                </slot>
            </div>
        </transition-group>
	</div>
	
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>