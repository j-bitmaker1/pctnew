<template>
<div class="listcontrols">
    <div class="searchWrapper">
        <search @search="search" :value="searchvalue" :activity="activity"/>
    </div>

    <div class="dateWrapper" v-if="datepicker">
        <datepicker v-model="date" :options="datepicker" :range="true"/>
    </div>

    <div class="sortWrapper">

        <div class="total">
            <span v-if="count">Total: {{count}}</span>
        </div>
      

        <div class="sorting" v-if="sorting">
            <select class="custom" @change="sort" :value="sortvalue">
                <option :value="i" v-for="(sort, i) in sorting" :key="i">{{$t('sort.' + sort.text)}}</option>
            </select>
        </div>

        <div class="filters" :class="{active : filtersApplyied}" v-if="filters" @click="showfilters">
            <i class="fas fa-filter"></i>
        </div>

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
