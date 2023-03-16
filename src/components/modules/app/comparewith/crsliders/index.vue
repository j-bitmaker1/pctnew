<template>
<div id="comparewith_crsliders">
    <div class="crslider">

        <div class="crline">
        </div>

        <div :class="'item'" :style="'left:' + (ct.ocr) + '%;background:' + color(ct.ocr) + ';'" v-for="ct in cts.cts">
            <value :value="ct.ocr"></value>
        </div>

        <div class="legend">
            <div class="litem" v-for="(ct, i) in cts.cts">
                <div class="icon" :style="'background:' + color(ct.ocr) + ';'">
                </div>
                <div class="label">
                    <span>{{portfolios[i].name}}</span>
                </div>
            </div>
        </div>
    </div>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
