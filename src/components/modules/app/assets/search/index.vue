<template>
<div class="assets_search">
    <div class="searchWrapper mobp">
        <search ref="search" @paste="paste" @controlKey="controlKey" :controlKeys="searchresult.length ? true : false" placeholder="Search by assets" :value="searchvalue" @search="search" :loading="loading"/>
    </div>

    <div class="searchresult " v-if="searchresult.length">
        <list :items="searchresult" @click="select">
            <template v-slot:default="slotProps">

                <div class="asset" :class="{selected : slotProps.index == tipposition}">
                    <div class="twrapper">
                        <div class="ticker">
                            <span>{{slotProps.item.ticker}}</span>
                        </div>
                    </div>
                    <div class="name">
                        <span>{{slotProps.item.name}}</span>
                    </div>
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
