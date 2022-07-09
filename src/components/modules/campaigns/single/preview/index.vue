<template>
<div class="campaigns_single_preview">
    <div class="header">
        <div class="info" @click="open">
            <div class="name">
                <span>{{campaign.RecipientName}}</span>
            </div>

            <div class="template">
                <span>{{campaign.RecipientEmail}}</span>
            </div>
        </div>

        <div class="hasopened" v-if="campaign.HaveOpenedMail">
            <i class="fas fa-envelope-open"></i>
        </div>

        <div class="formenu">
            <cmenu :campaign="campaign"/>
        </div>
    </div>

    <div class="statusrow" @click="open">
        <status :status="campaign.Status" :error="campaign.Error"/>

        <date :date="campaign.Started"/>
    </div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
