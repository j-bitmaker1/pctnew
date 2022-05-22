<template>
<div class="listpaginated">

    <div class="nothingfound" v-if="!loading && !count">
        <span>Nothing found</span>
    </div>

    <div class="listWrapper">
        <list ref="list" :selectOptions="selectOptions" :items="records" :elheight="elheight" @click="click" @selectionSuccess="selectionSuccess" @selectionCancel="selectionCancel" @selectionChange="selectionChange">
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
