<template>
<div class="listpaginated">

    <div class="nothingfound" v-if="!loading && !count">
        <span>Nothing found</span>
    </div>

    <div class="listWrapper">
        <listselectable :transition="transition" ref="list" :context="select.context" :filter="select.filter" :items="records" @click="click">
            <template v-slot:default="slotProps">
                <slot v-bind:item="slotProps.item">
                </slot>
            </template>
        </listselectable>
    </div>

    <div class="loading" v-if="loading">
        <linepreloader />
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
