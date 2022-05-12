<template>
<div class="portfolios_crashtest_details">.

    <list :items="ct.scenarios" @click="select">
        <template v-slot:default="slotProps">

            <div class="scenarioWrapper">
                <scenario :scenario="slotProps.item" :ct="ct" :maxabs="maxabs" />
            </div>

        </template>
    </list>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
