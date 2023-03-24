<template>
<div id="portfolio_retrospective">

    <linepreloader v-if="loading" />

    <template v-else>

        <div class="controls">
            <div class="sliderWrapper">
                <slider v-model="range" name="Range" mode="string" :options="sliderOptions"/>
            </div>
        </div>

        <div class="chartWrapper">
            <highcharts ref="chart" :options="chartOptions"></highcharts>
        </div>

    </template>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
