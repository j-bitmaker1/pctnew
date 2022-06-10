<template>
<div id="allocation_main">
    <div class="chartWrapper mobp">
        <highcharts ref="chart" :options="chartOptions"></highcharts>
    </div>

    <div class="legend">
        <div class="caption mobp" v-if="drilldown">
            <span>{{drilldown.name}}</span>
        </div>
        <list :items="currentSerie.data" @click="clickLegend">
            <template v-slot:default="slotProps">
                <div class="serie mobp">
                    <serie :name="slotProps.item.name" :y="slotProps.item.y" :color="slotProps.item.color"/>
                </div>
            </template>
        </list>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
