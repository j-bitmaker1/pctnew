<template>
<div id="campaigns_templates">

    <linepreloader v-if="loading" />

    <div class="cnt" v-if="!loading && templates">

        <div class="controls mobp">
            <listcontrols @search="search" :searchvalue="searchvalue" />
        </div>

        <listgroupedsliced :group="grouped" :count="10" ref="list">

            <template v-slot:group="slotProps">
                <div class="groupCaption mobp">
                    <span>{{slotProps.index}}</span>
                </div>
            </template>

            <template v-slot:list="slotProps">
                <div class="templateWrapper mobp">
                    <preview :template="slotProps.item" @open="e => {open(slotProps.item)}"/>
                </div>
            </template>
        </listgroupedsliced>

        
    </div>

    <div class="empty">
        <span></span>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
