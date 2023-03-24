<template>
<div id="scenarios_custom2">

    <div class="header">
        <div class="forheader">
            <span>Custom stress test</span>
        </div>
    </div>

  
    
    <div class="factors">

        <!--<div class="header">
            <div class="caption">
                <span>Factors</span>
            </div>
        </div>-->

        <div class="empty" v-if="!hasfactors" @click="addfactor">
            <span>Add factors to you custom scenario</span>
        </div>

        <list :items="factors" v-else>
            <template v-slot:default="slotProps">

                <div class="factorWrapper">
                    <factor :factor="slotProps.item" @changed="v => {changed(slotProps.item, v)}" />
                </div>

            </template>
        </list>

        <div class="panel">
            <button class="button small" @click="addfactor">
                Select factors
            </button>

            <button class="button small" @click="savescenario" v-if="canloadStrong">
                Save
            </button>
        </div>

        <div class="losswrapper " v-if="dct && canload">
            <linepreloader v-if="dctloading"/>
        </div>

    </div>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
