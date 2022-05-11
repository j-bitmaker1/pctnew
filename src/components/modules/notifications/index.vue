<template>
<div id="notifications">

    <listpaginated api="notifications.list" :payload="payload" :start="0" from="pageNumber" to="pageSize" ref="list" :bypages="true">
        <template v-slot:default="slotProps">
            <div class="cardWrapper">
                <notification :event="slotProps.item"/>
            </div>
        </template>
    </listpaginated>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
