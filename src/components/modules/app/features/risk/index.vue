<template>
<div class="features_risk">

    <div class="summary mobp">
		<summarybutton :sclass="item.negative ? 'negative' : 'positive'" v-for="item in summary" :key="item.index" mode="p" :text="item.text" :number="item.value / 100"/>
	</div>

    <div class="options">
        <div class="slider mobp customslider" :class="{negative : slider.scenario.negative}" :key="i" v-for="(slider, i) in sliders">

            <div class="sheader">

                <div class="name">
                    <span>{{slider.scenario.description}}</span>
                </div>

                <div class="value">
                </div>

            </div>

            <div class="inputwrapper">
                <div class="fill" :style="{'flex-basis' : slider.space + '%'}"></div>
                <div class="sliderwrapper" :style="{'flex-basis' : 100 - slider.space + '%'}">
                    <vue-slider :lazy="true" :value="summary[i].value" @change="e => {change(e, slider)}" v-bind="slider.options" />
                </div>
            </div>

            <div class="minmax">
                <div class="min">
                    <value :value="slider.psrange.min / 100" :mode="slider.mode" />
                </div>
                <div class="max">
                    <value :value="slider.psrange.max / 100" :mode="slider.mode" />
                </div>
            </div>
            
        </div>

    </div>
</div>

</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
