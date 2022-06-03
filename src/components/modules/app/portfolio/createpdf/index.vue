<template>
<div id="portfolio_createpdf">

    <linepreloader v-if="loading"/>

    <div v-if="!loading">

         <div class="settings">
            <div class="caption mobp">
                <span>Settings</span>
            </div>

            <div class="form">
                <settingsPdf/>
            </div>
        </div>

        <div class="reports">
            <div class="caption mobp">
                <span>Select pages</span>
            </div>

            <div class="form">
                <forms :fields="reports" :value="values" @change="changeReports"/>
            </div>
        </div>

       

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
