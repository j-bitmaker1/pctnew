<template>
<div id="campaigns_batch_main">

    <!---->

   

    <div class="chartWrapper mobp" v-if="batch.Status != 'PREPAIRING' && batch.Status != 'PREPAIRINGFAILED'">
        <div class="swr">
            <sticker :src="sticker" :width="128" />
        </div>
        <div class="chw">
            <highcharts ref="chart" :options="chartOptions"></highcharts>
        </div>
    </div>

    <div class="meta mobp">
        <div class="datewrapper">
            <span>Created</span> <span>&middot;</span> <date :date="batch.Created" />
        </div>
    </div>

    <div class="statusrow mobp">
        <status :status="batch.Status" />
    </div>

     

    <div class="summary mobp" v-if="batch.Status != 'PREPAIRING' && batch.Status != 'PREPAIRINGFAILED'">
		<summarybutton :reversed="true" :colored="true" v-for="item in summary" :key="item.index" :text="item.text" :number="batch[item.index]"/>
    </div>

    <div class="listWrapper" v-if="batch.Status != 'PREPAIRINGFAILED'">
        <campaignslist :batch="batch"/>
    </div>
   
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
