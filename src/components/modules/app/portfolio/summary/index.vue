<template>
<div id="portfolio_summary" :class="{portfolio : portfolio}">

    <template v-if="!mobileview">

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

            <div class="logowrapper">
                <logotype :small="true"/>
            </div>

            <!--<div class="portfolioPart" v-if="portfolio">

                <portfolioMenu :portfolio="portfolio" :profile="profile" @changeclient="changeclient" @edit="editportfolio" @deleteportfolio="deleteportfolio" />
                
            </div>-->
            
        </div>

        <div class="bodyWrapper">
            <div class="left part customscroll">
                <div class="pcntwrapper">
                    <div class="pcnt">

                        <portfolioCaption :portfolio="portfolio" :profile="profile" @changeclient="changeclient" @edit="editportfolio" @deleteportfolio="deleteportfolio" />

                        <shares @temp="tempassets" @cancelTemp="cancelTempAssets" :editInsteadList="true" v-if="portfolio" :portfolio="portfolio" @editportfolio="editportfolio"/>

                    </div>
                    <div class="pmenuwrapper">    
                        <div class="pmenu">
                            <portfoliomenu v-if="portfolio" :ext="true" buttonclass="diconbutton" @changeClient="changeclient" @edit="editportfolio" @delete="deleteportfolio" :portfolio="portfolio" />

                        </div>
                    </div>
                </div>
            </div>
            <div class="center part customscroll">

                <div class="pcntwrapper">
                    <div class="pcnt">

                        <crashtest :height="height" v-if="portfolio && !temp" ref="crashtest" :portfolio="portfolio" :profile="profile" @loaded="ctloaded" @scenarioMouseOver="scenarioMouseOver"/>
                        <crashtesttemp :height="height" v-if="portfolio && temp" ref="crashtest" :portfolio="portfolio" :assets="temp" @loaded="ctloaded" @scenarioMouseOver="scenarioMouseOver"/>

                    </div>
                    <div class="pmenuwrapper">    
                        <div class="pmenu">
                            
                            <ctmenu v-if="portfolio" :ext="true" @scenariosChanged="scenariosChanged" @scoreConverterChanged="scoreConverterChanged"/>

                        </div>
                    </div>
                </div>

                
            </div>
            <div class="right part">
                <template  v-if="portfolio">

                    <linepreloader v-if="!ct"/>
                    <template  v-else>
                        <div class="emptyScenario" v-if="!selectedScenario || !ct || temp">
                            <div class="textWrapper">
                                <span v-if="(!selectedScenario || !ct) && !temp">Select scenario to see contributors</span>
                                <span v-if="temp">Risk contributors are not available in hot change mode</span>
                            </div>
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
            <div class="wrapper" v-if="!portfolioId">
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

            <div class="summaryPreloader" v-else>
                <linepreloader />
            </div>
            
        </div>
    </template>

    <template v-else>
        <div class="unsupportmobile">
            <div class="wrapper">
                <span>
                    This report is not displayed in this screen resolution
                </span>

                <router-link to="/">
                    <button class="small button">
                        Go to home page
                    </button>
                </router-link>
            </div>
        </div>
    </template>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
