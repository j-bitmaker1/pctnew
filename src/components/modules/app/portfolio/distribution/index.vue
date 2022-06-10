<template>
<div id="distribution">

    <div class="report">

        <distributionMain :portfolio="portfolio" :period="period" :current_std="current_std" />

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
