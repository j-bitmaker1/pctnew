<template>
<div id="campaigns_signatures">

    <linepreloader v-if="loading" />

    <div class="cnt" v-if="!loading && signatures">

        <!--<div class="panel mobp" v-if="!select">
            <router-link to="/campaigns/emailtemplate/new">
                <button class="button">Create email template</button>
            </router-link>
        </div>-->

        <div class="controls mobp">
            <listcontrols @search="search" :searchvalue="searchvalue" />
        </div>

        <list :items="sorted" ref="list" v-if="filtered.length">
            <template v-slot:default="slotProps">
                <div class="signatureWrapper mobp" :class="{selected : selected == slotProps.item.Id}">
                    <preview :signature="slotProps.item" @open="e => {open(slotProps.item)}" @deleted="e => {deleted(slotProps.item)}"/>
                </div>
            </template>
        </list>

        <div class="empty" v-else>
            <span>Signatures not found</span>
        </div>
    </div>

    

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
