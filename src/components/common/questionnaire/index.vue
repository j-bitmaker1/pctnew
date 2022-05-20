<template>
<div id="questionnaire">
    <sequence @finish="finish" @back="exit" ref="sequence" :pages="pages" direction="vertical">
        <template v-slot:default="slotProps">

            <component :ref="slotProps.item.id" @next="result => {next(slotProps.item, result)}" @back="e => {back(slotProps.item)}" :values="values" v-if="getmodule(slotProps.item)" :is="getmodule(slotProps.item)" v-bind="slotProps.item.data || {}"/>

            <!--<slot v-else v-bind:item="slotProps.item" @next="result => {next(slotProps.item, result)}" @back="e => {back(slotProps.item)}">
            </slot>-->

        </template>
    </sequence>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
