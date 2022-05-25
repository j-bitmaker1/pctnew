<template>
<div class="assets_list ">
    <list :items="assets">
        <template v-slot:default="slotProps">

            <div class="assetWrapper mobp">
                <asset :asset="slotProps.item" :info="assetsinfo[slotProps.item.ticker]"/>
            </div>

        </template>
    </list>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
