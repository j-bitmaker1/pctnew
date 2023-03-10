<template>
<div id="portfolio_summary">

    <div class="loading" v-if="loading">
        <linepreloader />
    </div>

    <template v-else>

        <div class="headerWrapper mobp">

            <div class="captionsl">

                <div class="clientinfo" v-if="profile">
                    <client :profile="profile" :small="true"/>
                </div>
                
                <div class="divider" v-if="profile">
                    <span>/</span>
                </div>

                <div>
                    <span>{{portfolio.name}}</span>
                </div>

                <div class="divider">
                    <span>&middot;</span>
                </div>

                <div class="forvalue">
                    <value :value="portfolio.total() + portfolio.uncovered()" :mode="portfolio.isModel ? 'p100' : 'd'" />
                </div>

            </div>

            <div class="portfolioMenu">
			    <portfoliomenu @changeClient="changeClient" @edit="editportfolio" @delete="deleteportfolio" :portfolio="portfolio" />
            </div>

            <!--<div class="potfoliosHistory">
                <i class="fas fa-chevron-down"></i>
            </div>-->
            
        </div>

        <div class="bodyWrapper">
            <div class="left part customscroll">
                <shares :portfolio="portfolio" @editportfolio="editportfolio"/>
            </div>
            <div class="center part customscroll">
                <crashtest ref="crashtest" :portfolio="portfolio" @loaded="ctloaded" @scenarioMouseOver="scenarioMouseOver"/>
            </div>
            <div class="right part customscroll">
                <div class="emptyScenario" v-if="!selectedScenario || !ct">
                    <div class="textWrapper"><span>Select scenario to see contributors</span></div>
                </div>
                <div class="scenario" v-else>
                    <div class="header mobp">
                        <span>{{selectedScenario.name}}</span>
                    </div>
                    <scenariodetails :portfolio="portfolio" :scenario="selectedScenario" :ct="ct"/>
                    
                </div>
                
            </div>
        </div>
    </template>

    

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
