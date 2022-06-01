<template>
<div id="portfolio_createpdf">

    <linepreloader v-if="loading"/>

    <div v-if="!loading">
        <div class="savePanel">
            <button class="button black" @click="cancel">
                Cancel
            </button>

            <button class="button" @click="make">
                Create
            </button>
        </div>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
