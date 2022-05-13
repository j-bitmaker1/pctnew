<template>
<div id="distribution">

    <linepreloader v-if="loading"/>

    <div class="report" v-else>

        <div class="summary mobp">
            <summarybutton v-for="item in summary" :key="item.index" :text="item.text" :number="deviation[item.index]"/>
        </div>
        <div class="chartWrapper mobp">
            <highcharts :options="chartOptions"></highcharts>
        </div>

        <div class="controls mobp">
            <div>
                <span class="scaption">Period</span>
                <select class="custom" @change="changeperiod" :value="period">
                    <option :value="v.value" v-for="v in periods" :key="v.value">{{$t(v.text)}}</option>
                </select>
            </div>
            <div>
                <span class="scaption">Deviation</span>
                <select class="custom" @change="changestd" :value="current_std">
                    <option :value="v.value" v-for="v in stds" :key="v.value">{{$t(v.text)}}</option>
                </select>
            </div>
        </div>

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
