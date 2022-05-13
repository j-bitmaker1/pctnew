<template>
<div id="allocation">

    <div class="controls mobp">
        <div class="grouping">
            <select class="custom likecaption" @change="grouping" :value="activegrouping">
                <option :value="group.id" v-for="group in groups" :key="group.id">{{$t(group.text)}}</option>
            </select>
        </div>

        <!--<div class="forlist">
            <div class="diconbutton">
                <i class="fas fa-list" @click="edit"></i>
            </div>
        </div>-->
    </div>

    <div class="chartWrapper mobp">
        <highcharts :options="chartOptions"></highcharts>
    </div>

    <div class="legend">
    </div>

    <div class="assets">
        <assets :assets="assets"/>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
