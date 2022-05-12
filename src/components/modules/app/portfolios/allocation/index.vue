<template>
<div id="allocation">

    <div class="controls">
        <div class="grouping">
            <select class="custom" @change="grouping" :value="activegrouping">
                <option :value="group.id" v-for="group in groups" :key="group.id">{{$t(group.text)}}</option>
            </select>
        </div>
    </div>

    <div class="chartWrapper mobp">
        <highcharts :options="chartOptions"></highcharts>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
