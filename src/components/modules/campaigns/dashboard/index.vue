<template>
<div id="campaigns_dashboard">

    <div class="limits mobp" >
        <div class="caption">
            <span>Limits</span>
        </div>
        <div class="items" v-if="stats">
            <div class="item">
                <div class="label">
                    <span>Active campaigns</span>
                </div>

                <div class="value">
                    <span class="b">{{stats.ActiveCampaigns}}</span> <span>from</span> <span >{{stats.ActiveLimit}}</span>
                </div>
            </div>

            <div class="item">
                <div class="label">
                    <span>Monthly Limit</span>
                </div>

                <div class="value">
                    <span class="b">{{stats.MonthlyTotalCampaigns}}</span> <span>from</span> <span >{{stats.MonthlyLimit}}</span>
                </div>
            </div>
        </div>

        <linepreloader v-else/>
    </div>
    


    <div class="controls mobp">
        <listcontrols store="campaigns_dashboard" @date="setdate" :listdate="listdate" :datepicker="datepicker" :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" />
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
