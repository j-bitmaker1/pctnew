<template>
<div id="portfolio_summary" :class="{portfolio : portfolio}">

    <div class="loading" v-if="loading">
        <linepreloader />
    </div>


    <div class="headerWrapper mobp">

        <div class="firstmenu">

            <button class="button small round ghost" @click="selectPortfolio">
                <i class="fas fa-search"></i>
            </button>
            
            <homeAdd :ext="true" @success="homeadd"/>

            <!--<button class="button small">
                <i class="fas fa-plus"></i> Create portfolio
            </button>-->

            
            <!--<div class="potfoliosHistory" @click="selectPortfolio">
                <i class="fas fa-chevron-down"></i>
            </div>-->
        </div>

        <div class="portfolioPart" v-if="portfolio">

            <div class="captionsl">

                <div class="clientinfo" v-if="profile">
                    <client :profile="profile" :small="true"/>
                </div>
                
                <div class="divider" v-if="profile">
                    <span>/</span>
                </div>

                <div class="portfolioname">
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

            
        </div>
        
    </div>

    <div class="bodyWrapper">
        <div class="left part customscroll">
            <shares :editInsteadList="true" v-if="portfolio" :portfolio="portfolio" @editportfolio="editportfolio"/>
        </div>
        <div class="center part customscroll">
            <crashtest  v-if="portfolio" ref="crashtest" :portfolio="portfolio" @loaded="ctloaded" @scenarioMouseOver="scenarioMouseOver"/>
        </div>
        <div class="right part">
            <template  v-if="portfolio">

                <linepreloader v-if="!ct"/>
                <template  v-else>
                    <div class="emptyScenario" v-if="!selectedScenario || !ct">
                        <div class="textWrapper"><span>Select scenario to see contributors</span></div>
                    </div>
                    <div class="scenario" v-else>
                        <!--<div class="header mobp">
                            <span>{{selectedScenario.name}}</span>
                        </div>-->
                        <scenariodetails :lossgain="true" :portfolio="portfolio" :scenario="selectedScenario" :ct="ct"/>
                        
                    </div>
                </template>
            </template>
            
        </div>
    </div>

    <div class="portfoliotip" v-if="!portfolio">
        <div class="wrapper">
            <span>Load or select a portfolio and get Stress test!</span>
            <div class="stickerWrapper">
                <sticker src="goal.png" :width="128"/>
            </div>

            <div class="iflast" v-if="last && last.data && last.data.portfolio">
                <div class="lpwrapper" @click="gotolast">
                    <span>Go to last Portfolio:</span> 
                    <span class="lpname">{{last.data.portfolio.name}}</span>
                </div>
            </div>

            
            <div class="menu">
                <button class="button small" @click="createportfolio">
                    <i class="fas fa-suitcase"></i> New portfolio
                </button>
                <button class="button small round ghost" @click="selectPortfolio">
                    <i class="fas fa-search"></i>
                </button>
            </div>

            
        </div>

        
    </div>

    

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
