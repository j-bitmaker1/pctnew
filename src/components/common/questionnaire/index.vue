<template>
<div id="questionnaire">
    <sequence ref="sequence" :pages="pages" direction="vertical">
        <template v-slot:default="slotProps" >
            <component @next="result => {next(slotProps.item, result)}" @back="e => {back(slotProps.item)}" :values="values" v-if="getmodule(slotProps.item)" :is="getmodule(slotProps.item)" v-bind="slotProps.item.data || {}"/>
        </template>
    </sequence>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
