<template>
<div>
    <div class="items">
        <transition-group name="menulis2t" tag="div">
            <div class="item" v-bind:key="item.click" v-for="item in filteredItems">
                <slot v-bind:item="item">
                </slot>
            </div>
        </transition-group>
    </div>
</div>
</template>

<script>
export default {
    name: 'simpleMenu',
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    computed: {
        filteredItems: function () {
            return this.items.filter(item => !item.hidden);
        }
    },
}
</script>

<style scoped lang="sass" src="./index.sass"></style>