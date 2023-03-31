<template>
<div id="buylists_lists">

    

    <div class="controls mobp">
        <listcontrols @search="search" :searchvalue="searchvalue"/>
    </div>

    <div class="panel mobp">
        <button class="button small" @click="createbuylist">
            <i class="fas fa-plus"></i> Create buy list
        </button>
    </div>

    <list :items="filtered" :count="10" ref="list">

        <template v-slot:list="slotProps">
            <div class="wrapper mobp" @click="e => select(slotProps.item)">
                <buylist :buylist="slotProps.item" />
            </div>
            
        </template>
    </list>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
