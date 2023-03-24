<template>
<div id="compare_allocation">

    <linepreloader v-if="loading" />

    <div class="cnt" v-else>

        <div class="controls mobp">
            <div class="grouping">
                <select class="custom likecaption" @change="grouping" :value="activegrouping">
                    <option :value="group.id" v-for="group in groups" :key="group.id">{{$t(group.text)}}</option>
                </select>
            </div>
        </div>

        <div class="wrapper">
        
            <div class="allocation" v-for="portfolio in portfolios" :key="portfolio.id">
                <div class="name">
                    <div class="nameB">
                        <div class="detailspanel" @click="e => showassets(portfolio.id)">
                            <i class="fas fa-list-ul"></i>
                        </div>
                        <span>{{portfolio.name}}</span>
                        <div class="selectionpanel">
                            <i class="fas fa-search" @click="e => selectone(portfolio.id)"></i>
                            <i class="fas fa-times" @click="e => removeitem(portfolio.id)"></i>
                        </div>
                    </div>
                </div>
                <div class="dwrapper">
                    <allocationMain :portfolio="portfolio" :ref="portfolio.id" @drilldown="id => drilldown(id, portfolio)" @drillup="() => drillup(portfolio)" :colors="colors" @groups="grouped => {getgroups(portfolio, grouped)}" :options="{ height : 300 }" :assets="portfolio.positions" :activegrouping="activegrouping"/>
                </div>
            </div>
        </div>
    </div>

    

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
