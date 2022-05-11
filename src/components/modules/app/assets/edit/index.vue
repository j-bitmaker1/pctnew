<template>
<div class="assets_edit">
    <div class="ticker">
        <span>{{ticker}}</span>
    </div>
    <div class="name">
        <input ref="nameinput" @focus="focus" @blur="blur" :value="namestring || name" @keyup="namechange" @change="namechange" placeholder="Enter asset name or ticker" />
    </div>

    <div class="value">
        <input :disabled="!ticker" :value="value ? value : ''" ref="valueinput" placeholder="0" @change="changevalue"/>
    </div>

    <div class="searchresult customscroll" v-if="searchresult.length">
        <list :items="searchresult" @click="select">
            <template v-slot:default="slotProps">

                <div class="assets_fromsearch" >
                    <div class="ticker">
                        <span>{{slotProps.item.ID}}</span>
                    </div>
                    <div class="name">
                        <span>{{slotProps.item.n}}</span>
                    </div>
                </div>

            </template>
        </list>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
