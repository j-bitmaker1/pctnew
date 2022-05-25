<template>
<div id="activity">

    <listgroupedsliced :group="mixgrouped" :count="4">

        <template v-slot:group="slotProps">
            <div class="groupCaption mobp">
                <span>{{$t('activity.' + slotProps.index)}}</span>
            </div>
        </template>

        <template v-slot:list="slotProps">
            <div class="act mobp">

                <component @open="e => open(slotProps.item)" v-if="getmodule(slotProps.item)" :is="getmodule(slotProps.item)" v-bind="slotProps.item.data || {}">
                </component>

                <span v-else>{{slotProps.item.search}}</span>

                
            </div>
        </template>

    </listgroupedsliced>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
