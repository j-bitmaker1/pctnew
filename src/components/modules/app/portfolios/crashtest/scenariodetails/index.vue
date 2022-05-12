<template>
<div id="portfolios_crashtest_scenariodetails">
    <div class="losswrapper">
        <value :value="scenario.loss" mode="auto" colored="true" />
    </div>

    <div class="descriptions">
        <div class="caption">
            <span>Description</span>
        </div>

        <div class="shortDescription">
            {{scenario.shock}}
        </div>

        <div class="caption">
            <span>Event duration</span>
        </div>

        <div class="shortDescription">
            {{scenario.shortDescription}}
        </div>

    </div>

    <div class="contributors">

        <linepreloader v-if="loading" />

        <div v-else>
            <div class="header">
                <div class="headercaption">
                    <span>Contributors</span>
                </div>
                <div class="lossicons">
                    <div class="positive" v-if="positives"><i class="fas fa-arrow-up"></i>
                        <value :value="positives" />
                    </div>
                    <div class="negative" v-if="negatives"><i class="fas fa-arrow-down"></i>
                        <value :value="negatives" />
                    </div>
                </div>
            </div>

            <div class="contributorsList">
                <list :items="contributors">
                    <template v-slot:default="slotProps">

                        <div class="contributorWrapper">
                            <contributor :contributor="slotProps.item" :ct="ct" :maxabs="maxabs" />
                        </div>

                    </template>
                </list>
            </div>

        </div>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
