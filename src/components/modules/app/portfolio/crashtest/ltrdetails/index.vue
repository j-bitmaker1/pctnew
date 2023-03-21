<template>
<div id="portfolio_ltrdetails">

    <div class="loader" v-if="loading">
        <linepreloader  />
    </div>

    <div class="tableswrapper customscrollHorizontal">

        <div class="tablewrapper " v-for="portfolio in portfolios" :key="portfolio.id">
            <div class="header">
                <span>Portfolio: {{portfolio.name}} &middot; </span> <value :mode="portfolio.isModel ? 'p100' : 'd'" :value="portfolio.total()" />
            </div>
            <table >
                <thead>
                    <tr>
                        <th v-for="column in columns" :key="column.id">
                            <span>{{$t('ltrdetails.header.' + column.id)}}</span> <sup v-if="column.tip"><i class="fas fa-asterisk"></i></sup>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="asset in rows[portfolio.id]" :key="asset.ticker">
                        <td v-for="column in columns" :key="column.id">
                            <span v-if="column.type == 'string'">{{asset[column.id]}}</span>
                            <value :mode="column.type" v-if="!column.type || column.type == 'p' || column.type == 'd'" :value="asset[column.id] || 0" />
                            <portfoliovalue v-if="column.type == 'portfolioValue'" :portfolio="portfolio" :value="asset[column.id]"/>

                        </td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    </div>

    <div class="tips">
        <div class="tip" v-for="tip in tips">
            <span class="name">{{$t('ltrdetails.header.' + tip.id)}}</span> <span class="divider">&mdash;</span> <span class="tip">{{$t('ltrdetails.tip.' + tip.id)}}</span>
        </div>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
