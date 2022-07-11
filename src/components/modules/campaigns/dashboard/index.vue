<template>
<div id="campaigns_dashboard">
    <div class="controls mobp">
        <listcontrols @date="setdate" :listdate="listdate" :datepicker="datepicker" :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" />
    </div>

    <listpaginated placeholder="No batch campaigns found" :select="select" :api="api" :payload="payload" @count="setcount" :start="0" from="PageNumber" to="PageSize" ref="list" :bypages="true">
        <template v-slot:default="slotProps">
            <div class="cardWrapper mobp">
                <batchPreview @deletebatch="e => {deletebatch(slotProps.item)}" :batch="slotProps.item" @open="e => {open(slotProps.item)}"/>
            </div>
        </template>
    </listpaginated>

    <selection :context="select.context" v-if="!select && !select.disableMenu" :menu="menu" />
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
