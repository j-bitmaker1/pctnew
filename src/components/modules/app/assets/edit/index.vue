<template>
<div class="assets_edit">

    <div class="ticker" v-if="ticker" :uncovered="!isCovered">
        <span>{{ticker}}</span>
    </div>

    <div class="assets_inputs">

        <div class="name">
            <input ref="nameinput" @focus="focus" @blur="blur" :value="focused ? namestring : (namestring || name)" @keyup="namechange" @change="namechange" :placeholder="ticker && !isCovered ? 'Not covered' : 'Enter asset name or ticker'" />
        </div>

        <div class="value">
            <input :disabled="!ticker" :value="value ? value : ''" ref="valueinput" placeholder="0" @change="changevalue" />
        </div>

        <div class="searchresult customscroll" v-if="searchresult.length">
            <list :items="searchresult" @click="select">
                <template v-slot:default="slotProps">

                    <div class="assets_fromsearch">
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

    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
