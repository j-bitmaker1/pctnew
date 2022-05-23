<template>
<div id="portfolios_aggregation">
    <list ref="list" :items="aggregation.items" v-if="module">
        <template v-slot:default="slotProps">
            <div class="itemWrapper mobp" :ref="slotProps.item.id">
                <div class="itm">
                    <component :is="module" :hasmenu="false" v-bind="{[type] : slotProps.item.item}"/>
                </div>
            </div>
        </template>
    </list>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
