<template>
<div id="portfolios_crashtest">
    <linepreloader v-if="loading"/>

    <div class="ct" v-else>

        <div class="summary">
            <div class="block" v-for="item in summary" :key="item.index">

                <div class="label">
                    <span>{{$t(item.text)}}</span>
                </div>

                <div class="value">
                    <coloredNumber :number="ct[item.index]"/>
                </div>

                <div class="tip">
                    <i class="fas fa-question-circle"></i>
                </div>

            </div>
        </div>

        <div class="header">
            <div class="forpanel">
                <iconstoggle :icons="valuemodes" :value="valuemode" @change="changevaluemode"/>
            </div>
            <div class="forsettigns">
                <div class="diconbutton">
                    <i class="fas fa-cog"></i>
                </div>
            </div>
        </div>

        <div class="subheader">
            <div class="forvalue">
                <value :value="ct.total" mode="auto"/>
            </div>
            <div class="forvalues">
               <div class="positive"><i class="fas fa-arrow-up"></i> <value :value="ct.profit" mode="auto"/></div>
               <div class="negative"><i class="fas fa-arrow-down"></i> <value :value="ct.loss" mode="auto"/></div>
            </div>
        </div>

        <div class="chartWrapper">
            <chart :ct="ct"/>
        </div>

        <div class="caption">
            <span>Details</span>
        </div>

        <div class="detailsWrapper">
            <ctdetails :ct="ct"/>
        </div>

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
