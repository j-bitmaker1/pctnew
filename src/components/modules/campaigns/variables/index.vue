<template>
<div id="campaigns_variables">

    <div class="searchWrapper mobp">
        <search ref="search" @controlKey="controlKey" :controlKeys="filtered.length ? true : false" placeholder="Search by variables" :value="searchvalue" @search="search"/>
    </div>

    <div class="filtered " v-if="filtered.length">

        <listgroupedsliced :group="grouped" :count="10" ref="list">

            <template v-slot:group="slotProps">
                <div class="groupCaption mobp">
                    <span>{{$t('campaigns.variables.' + slotProps.index)}}</span>
                </div>
            </template>

            <template v-slot:list="slotProps">
                <div class="variableWrapper mobp" :class="{selected : slotProps.index == tipposition}" @click="e => {select(slotProps.item)}">
                    <variable :variable="slotProps.item"/>
                </div>
            </template>

        </listgroupedsliced>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
