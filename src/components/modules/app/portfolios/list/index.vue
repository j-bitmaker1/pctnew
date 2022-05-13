<template>
<div id="portfolios_list">
    <listpaginated api="pctapi.portfolios.list" :payload="payload" :start="0" from="pageNumber" to="pageSize" ref="list" :bypages="true">
        <template v-slot:default="slotProps">
            <div class="cardWrapper mobp">
                sa
            </div>
        </template>
    </listpaginated>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
