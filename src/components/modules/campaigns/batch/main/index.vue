<template>
<div id="campaigns_batch_main">

    <!---->

    <div class="chartWrapper mobp">
        <highcharts ref="chart" :options="chartOptions"></highcharts>
    </div>

    <div class="statusrow mobp">
        <status :status="batch.Status" />
    </div>

    <div class="summary mobp">
		<summarybutton :reversed="true" :colored="true" v-for="item in summary" :key="item.index" :text="item.text" :number="batch[item.index]"/>
    </div>

    <div class="listWrapper">
        <campaignslist :batch="batch"/>
    </div>
   
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
