<template>
<div id="leads">
    <div class="controls">
        <listcontrols :searchvalue="searchvalue" :count="count" :sorting="sorting" @search="search" @sort="sortchange"/>
    </div>
    <listpaginated api="crm.contacts.list" :payload="payload" :start="1" ref="list" @count="setcount" :elheight="elheight" @click="click">
        <template v-slot:default="slotProps">
            <div class="cardWrapper">
                <lead :profile="slotProps.item"/>
            </div>
        </template>
    </listpaginated>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
