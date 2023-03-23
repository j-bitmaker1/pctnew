<template>
<div id="portfolio_crashtest_scenariodefinitions">

    <div class="loader" v-if="loading">
        <linepreloader  />
    </div>

    <div class="info">
        <div class="caption">
            <span>How Scenarios are Constructed</span>
        </div>

        <div class="text">
            <span>
                Similar to a car crash testing system for automobiles, the Portfolio Crash Testing system is based on subjecting a portfolio to a series of market stress scenarios designed by industry experts and measuring the impact on the portfolio in each of those scenarios. Besides visualizing the measured impact in each scenario, the crash vulnerability rating for the portfolio is computed and compared to the overall universe of the Funds / ETFs.
            </span>
        </div>
        
    </div>

    <div class="info">
        <div class="caption">
            <span>Scenario Definitions:</span>
        </div>
    </div>

    <div class="tableswrapper">

        <table>
            <thead>
                <tr>
                    <th>
                        <span>Stress Scenarios</span>
                    </th>
                    <th>
                        <span>Description</span>
                    </th>
                    <th>
                        <span>Event Duration</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="scenario in scenarios" :key="scenarios.id" v-if="scenario.shocks">

                    <td>
                        <span v-if="scenario.name">{{scenario.name}}</span>
                    </td>

                    <td>
                        <span>{{scenario.shocks}}</span>
                        <sup v-if="rs.shocks[scenario.id]">{{rs.shocks[scenario.id].num}}</sup>
                    </td>

                    <td>
                        <span>{{scenario.description}}</span>
                        <sup v-if="rs.description[scenario.id]">{{rs.description[scenario.id].num}}</sup>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>

    <div class="tips">
        <div class="tip" v-for="tip in getre(['description', 'shocks'])">
            <span class="num">{{tip.num}}.</span>
            <span class="text">{{tip.text}}</span>
        </div>
    </div>

    <div class="info">
        <div class="caption">
            <span>Key Stress Scenarios:</span>
        </div>
    </div>

    <div class="tableswrapper">

        <table>
            <thead>
                <tr>
                    <th>
                        <span>Stress Scenarios</span>
                    </th>
                    <th :colspan="maxfactors">
                        <span>Shocks</span>
                    </th>
                    
                </tr>
            </thead>
            <tbody>
                <tr v-for="scenario in scenarios" :key="scenarios.id" v-if="scenario.shocks">

                    <td>
                        <div class="fv">
                            <span v-if="scenario.name">{{scenario.name}}</span>
                        </div>
                    </td>

                    <td v-for="i in maxfactors">
                        <template v-if="scenario.factors && scenario.factors[i - 1]">
                            <div class="fv">
                                <div class="namewr">
                                    <span class="name">{{scenario.factors[i - 1].name}}</span>
                                    <sup v-if="rs.factors[scenario.id + '' + (i - 1)]">{{rs.factors[scenario.id + '' + (i - 1)].num}}</sup>
                                </div>


                                <div class="vl">
                                    <i class="fas fa-arrow-down bad" v-if="scenario.factors[i - 1].value < 0"></i>
                                    <i class="fas fa-arrow-up good" v-if="scenario.factors[i - 1].value > 0"></i><value :value="Math.abs(scenario.factors[i - 1].value)" :mode="valuemode(scenario.factors[i - 1])"/>
                                </div>
                            </div>
                        </template>
                        
                    </td>
                    

                </tr>
            </tbody>
        </table>

    </div>

    <div class="tips">
        <div class="tip" v-for="tip in getre(['factors'])">
            <span class="num">{{tip.num}}.</span>
            <span class="text">{{tip.text}}</span>
        </div>
    </div>

    

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
