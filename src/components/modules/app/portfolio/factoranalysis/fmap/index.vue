<template>
<div id="factoranalysis_map">

    <div class="fmap mobp">
        <div class="spacer">
          
        </div>
        <div class="xfactor">
            <factor :factor="xfactor" @changeFactor="() => {changeFactor(0)}" @change="(v) => change(0, v)"/>
        </div>
        <div class="yfactor" >
            <factor :factor="yfactor" :rotated="true" @changeFactor="() => {changeFactor(1)}" @change="(v) => change(1, v)"/>
        </div>
        <div class="map"  :style="{'grid-template-columns' : 'repeat('+size+', 1fr)'}">

            <div class="value" :class="{zoomed : zoomed == index - 1}" v-touch="e => zoom(index - 1)" :style="{background : colorByIndex(index - 1)}" :key="index" v-for="index in size * size">
                <div class="result" v-if="result && result.scenarioResults[index - 1]">
                    <value :value="result.scenarioResults[index - 1].value.toFixed(0)" mode="d" />
                    <value v-if="portfolio && portfolio.total()" :value="result.scenarioResults[index - 1].value / portfolio.total()" mode="p" />
                </div>
            </div>

            <div v-if="loading" class="preloaderWrapper">
                <linepreloader />
            </div>
        </div>

        
    </div>

    <div class="legend" v-if="result && gradient && !loading">
        <div class="line">
        </div>
        <div class="values">
            <div class="min"><value :value="result.min.toFixed(0)" mode="d"/></div>
            <div class="max"><value :value="result.max.toFixed(0)" mode="d"/></div>
        </div>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
