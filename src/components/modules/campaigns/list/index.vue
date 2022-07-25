<template>
<div id="campaigns_list">
    <div class="controls mobp">
        <listcontrols :store="'batch_campaigns_' + batch.Id" :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" />
    </div>

    <listpaginated placeholder="No campaigns found" :select="{context : 'campaigns'}" :api="api" :payload="payload" @count="setcount" :start="0" from="PageNumber" to="PageSize" ref="list" :bypages="true">
        <template v-slot:default="slotProps">
            <div class="cardWrapper mobp">
               <campaignPreview @deletesignle="e => {deletesingle(slotProps.item)}" @open="e => {open(slotProps.item)}" :campaign="slotProps.item"/>
            </div>
        </template>
    </listpaginated>

    <selection context="campaigns" />
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
