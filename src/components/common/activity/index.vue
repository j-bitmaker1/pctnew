<template>
<div id="activity">

    <div class="empty" v-if="empty">
        <span v-if="searchvalue">{{$t('activity.empty')}}</span>
        <span v-else>{{$t('activity.totalEmpty')}}</span>
    </div>

    <listgroupedsliced :group="mixgrouped" :count="3">

        <template v-slot:group="slotProps">
            <div class="groupCaption mobp">
                <span>{{$t('activity.' + slotProps.index)}}</span>
            </div>
        </template>

        <template v-slot:list="slotProps">
            <div class="act mobp">

                <component @to="to" @open="e => open(slotProps.item)" v-if="getmodule(slotProps.item)" :is="getmodule(slotProps.item)" v-bind="slotProps.item.data || {}">
                </component>

                <span v-else>{{slotProps.item.search}}</span>

                
            </div>
        </template>

    </listgroupedsliced>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
