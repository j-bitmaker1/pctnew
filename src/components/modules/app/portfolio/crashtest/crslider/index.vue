<template>
<div id="crashtest_crslider">
    <div class="crslider" ref="slider">
        <div class="crline">
        </div>
        
        <div :ref="item.index" v-touch:start="e => mousedown(e, item)" @mousedown="e => mousedown(e, item)" v-if="value(item)" 
            
            :class="'item unselectable ' + item.index + (item.canoptimize? ' canoptimize' : '') + (item.temp ? ' temp' : '')" :style="'left:' + value(item) + '%;background:' + color(item) + ';'" v-for="item in markers" :title="item.text">

            <value :value="valuetext(item)"></value>
        </div>
        
        <div class="legend">
            <div v-if="value(item)" class="litem" v-for="item in markers">
                <div :class="'icon ' + (item.index)" :style="'background:' + color(item) + ';'">
                </div>
                <div class="label">
                    <span>{{item.text}}</span>
                </div>
            </div>
        </div>
    </div>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
