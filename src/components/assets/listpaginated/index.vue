<template>
<div class="listpaginated">

    <div class="listWrapper" >
        <list :items="records">
            <template v-slot:default="slotProps">
                <slot v-bind:item="slotProps.item">
                </slot>
            </template>
        </list>
    </div>

    <div class="loading" v-if="loading">
        <linepreloader />
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
