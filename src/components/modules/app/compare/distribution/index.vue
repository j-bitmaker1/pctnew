<template>
<div id="compare_distribution">
    <linepreloader v-if="loading" />

    <div class="cnt" v-else>
        <div class="distribution" v-for="portfolio in portfolios" :key="portfolio.id">
            <div class="name">
                <div class="nameB">
                    <span>{{portfolio.name}}</span>
                    <div class="selectionpanel">
						<i class="fas fa-search" @click="e => selectone(portfolio.id)"></i>
						<i class="fas fa-times" @click="e => removeitem(portfolio.id)"></i>
					</div>
                </div>
            </div>
            <div class="dwrapper">
                <distributionMain @serie="serie => {getserie(portfolio, serie)}" :options="options" :period="period" :current_std="current_std" :portfolio="portfolio"  />
            </div>
        </div>
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
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
