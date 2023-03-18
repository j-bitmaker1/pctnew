<template>
<div id="crashtest_crslider">
    <div class="crslider" ref="slider">
        <div class="crline">
        </div>
        <div :ref="(item.index || item.th)" @mousedown="e => mousedown(e, item)"   v-if="value(item)" :class="'item unselectable ' + (item.index || item.th)" :style="'left:' + value(item) + '%;background:' + color(item) + ';'" v-for="item in items">
            <value :value="valuetext(item)"></value>
        </div>
        <div class="legend">
            <div v-if="value(item)" class="litem" v-for="item in items">
                <div class="icon" :style="'background:' + color(item) + ';'">
                </div>
                <div class="label">
                    <span>{{$t('labels.crslider.' + (item.index || item.th))}}</span>
                </div>
            </div>
        </div>
    </div>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
