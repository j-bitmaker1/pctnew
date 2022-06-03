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

    <div class="making mobp" v-if="making">

        <div class="progressWrapper">
            <div class="pertcent">
                <value :value="progress" mode="p" />
            </div>
            <div class="label"><span>Creating PDF report</span></div>
            <div class="progress">
                <div class="bar" :style="{width : progress * 100 + '%'}">
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
