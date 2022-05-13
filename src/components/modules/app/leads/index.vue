<template>
<div id="leads">
    <div class="controls mobp">
        <listcontrols :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" />
    </div>
    <listpaginated @selectionSuccess="selectionSuccess" :selectMultiple="true" api="crm.contacts.list" :payload="payload" :start="1" ref="list" @count="setcount">
        <template v-slot:default="slotProps">
            <div class="cardWrapper mobp">
                <lead :profile="slotProps.item" />
            </div>
        </template>
    </listpaginated>

    <transition name="fademodal">
        <modal v-if="selected" @close="closeselected" mclass="small likemenu">

            <template v-slot:body>
                <listmenu :items="menu" @action="menuaction" :close="closeselected" />
            </template>

        </modal>
    </transition>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
