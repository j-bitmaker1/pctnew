<template>
<div id="emails_templates">

    <linepreloader v-if="loading" />

    <div class="cnt" v-if="!loading && templates">

        <!--<div class="panel mobp" v-if="!select">
            <router-link to="/campaigns/emailtemplate/new">
                <button class="button">Create email template</button>
            </router-link>
        </div>-->

        <div class="controls mobp">
            <listcontrols @search="search" :searchvalue="searchvalue" />
        </div>

        <listgroupedsliced :group="grouped" :count="5" ref="list" v-if="filtered.length">

            <template v-slot:group="slotProps">
                <div class="groupCaption mobp">
                    <span>{{$t('campaigns.emailGroups.' + slotProps.index)}}</span>
                </div>
            </template>

            <template v-slot:list="slotProps">
                <div class="templateWrapper mobp" :class="{selected : selected == slotProps.item.Id}">
                    <preview :template="slotProps.item" @open="e => {open(slotProps.item)}" @deleted="e => {deleted(slotProps.item)}"/>
                </div>
            </template>
        </listgroupedsliced>

        <div class="empty" v-else>
            <span>Email templates not found</span>
        </div>
    </div>

    

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
