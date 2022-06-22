<template>
<div class="campaigns_batch_preview">
    <div class="header">
        <div class="info" @click="open">
            <div class="name">
                <span>{{batch.Name}}</span>
            </div>

            <div class="template">
                <span>{{batch.TemplateName}}</span>
            </div>
        </div>

        <div class="formenu">
            <bmenu :batch="batch"/>
        </div>
    </div>

    <div class="statusrow" @click="open">
        <status :status="batch.Status" :errors="batch.ErrorCampaigns" :completed="batch.CompletedCampaigns" :total="batch.TotalCampaigns"/>

        <date :date="batch.Started"/>
    </div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
