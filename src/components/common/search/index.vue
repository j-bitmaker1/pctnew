<template>
<div class="common_search">
    <div class="searchWrapper mobp">
        <search ref="search" @paste="paste" @controlKey="controlKey" :controlKeys="searchresult.length ? true : false" placeholder="Search by assets" :value="searchvalue" @search="search" :loading="loading"/>
    </div>

    <div class="searchresult " v-if="searchresult.length">
        <list :items="searchresult" @click="select">
            <template v-slot:default="slotProps">

                <div class="item" :class="{selected : slotProps.index == tipposition}">
                    <slot name="item" :item="slotProps.item"/>
                </div>

            </template>
        </list>
    </div>

    <div class="empty mobp" v-if="!searchresult.length && searchvalue && !loading">
        <span>We couldn't find anything for the "{{searchvalue}}"</span>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
