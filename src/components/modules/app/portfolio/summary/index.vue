<template>
<div id="portfolio_summary" :class="{portfolio : portfolio, shift : shift}">

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

        <div class="bodyWrapper customscrollHorizontal" v-scroll="scrolling" ref="bodyWrapper">

            <widget name="left" :customscroll="true" :widgets="widgets">
                <template v-slot:content>

                    <div class="pcntwrapper">
                        <div class="pcnt">

                            <portfolioCaption :portfolio="portfolio" :profile="profile" @changeclient="changeclient" @edit="editportfolio" @deleteportfolio="deleteportfolio" />

                            <shares @temp="tempassets" @cancelTemp="cancelTempAssets" :editInsteadList="view == 'stresstest'" v-if="portfolio && !optimizedPortfolio" :portfolio="portfolio" @editportfolio="editportfolio"/>

                            <assetsdifference v-if="portfolio && optimizedPortfolio" :portfolio="portfolio" :optimized="optimizedPortfolio"/>

                        </div>
                        <div class="pmenuwrapper">    
                            <div class="pmenu" id="portfoliomenu">
                                <portfoliomenu v-if="portfolio" :ext="true" buttonclass="diconbutton" @changeClient="changeclient" @edit="editportfolio" @delete="deleteportfolio" :portfolio="portfolio" />
                            </div>
                        </div>
                    </div>
                    
                </template>
            </widget>

            <widget name="center" :customscroll="true" :widgets="widgets">
                <template v-slot:content>
                    <div class="pcntwrapper">
                        <div class="pcnt" v-if="view == 'stresstest'">

                            <crashtest @optimized="optimized" :height="height" v-if="portfolio && !temp" ref="crashtest" :portfolio="portfolio" :profile="profile" @loaded="ctloaded" @scenarioMouseOver="scenarioMouseOver"/>
                            <crashtesttemp name="Editing portfolio" :height="height" v-if="portfolio && temp" ref="crashtest" :portfolio="portfolio" :assets="temp" @loaded="ctloaded" @scenarioMouseOver="scenarioMouseOver"/>

                        </div>

                        <div class="pcnt" v-if="view == 'customstresstest'" >
                            <customstresstest v-if="portfolio" :portfolio="portfolio" :lastFactors="lastCustomFactors" @loaded="customStressTestLoaded" @scenarioMouseOver="scenarioMouseOver" @factors="saveFactors" @customscenariosaved="customscenariosaved"/>
                        </div>


                        <div class="pmenuwrapper" >    
                            <div class="pmenu" id="crashtestmenu">

                                <template v-if="portfolio && !optimizedPortfolio">

                                    <div class="menuitem" v-if="view=='stresstest'" title="Custom stress test" @click="changeView('customstresstest')">
                                        <i class="fas fa-tools"></i>
                                    </div>

                                    <div class="menuitem active" v-if="view=='customstresstest'" title="Close custom stress test" @click="changeView('stresstest')">
                                        <i class="fas fa-times"></i>
                                    </div>

                                </template>

                                <ctmenu :cts="cts" :portfolios="{[portfolio.id] : portfolio}" v-if="portfolio" :ext="true" @scenariosChanged="scenariosChanged" @scoreConverterChanged="scoreConverterChanged"/>

                            </div>
                        </div>
                    </div>
                </template>
            </widget>

            <widget name="right" :cls="!optimizedPortfolio ? 'scrollhidden' : ''" :customscroll="optimizedPortfolio ? true : false" :widgets="widgets">
                <template v-slot:content>
                    <div class="pcntwrapper">
                        <div class="pcnt">
                            <template  v-if="portfolio">

                                <template v-if="view == 'stresstest'">

                                    <template v-if="!optimizedPortfolio">
                                        <div class="emptyScenario" v-if="!selectedScenario || !ct || temp">

                                            <div class="textWrapper">
                                                
                                                <span v-if="(!selectedScenario || !ct) && !temp">Select scenario to see contributors</span>
                                                <span v-if="temp">Risk contributors are not available in hot change mode</span>
                                            
                                            </div>
                                        </div>
                                        <div class="scenario" v-else>
                                            <scenariodetails :lossgain="true" :portfolio="portfolio" :scenario="selectedScenario" :ct="ct"/>
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div class="partcaption">
                                            <span>Optimization settings</span>
                                        </div>
                                        <optimizationSettings :portfolio="portfolio" :saveonchange="true"/>
                                    </template>

                                    
                                </template>

                                <template v-if="view == 'customstresstest'">

                                    <!--<linepreloader v-if="lastCustomFactors && !lastCustomResult"/>-->


                                    <div class="emptyScenario" v-if="!lastCustomFactors || !lastCustomResult">
                                        <div class="textWrapper">
                                            <span v-if="!lastCustomFactors">Create custom scenario to see contributors</span> <span v-if="!lastCustomResult">Adjust the factors and get the result</span>
                                        </div>
                                    </div>

                                    <div class="scenario" v-else>
                                        <scenariodetails :lossgain="true" :portfolio="portfolio" :dcti="lastCustomResult" :scenario="lastCustomResult.scenarios[0]" :infoi="{
                                            name : 'Custom scenario',
                                            factors : lastCustomFactors,
                                            description : ''
                                        }"/>
                                    </div>

                                </template>
                                
                            </template>

                        </div>
                    </div>
                </template>
            </widget>

            <widget name="retrospective" :customscroll="false" :widgets="widgets">
                <template v-slot:content>
                    <div class="pcntwrapper">
                        <div class="pcnt">
                            <div class="partcaption">
                                <span>Historical simulation</span>
                            </div>
                            <template  v-if="portfolio">

                                <retrospective :height="height" v-if="portfolio && !temp && !optimizedPortfolio" :portfolio="portfolio"/>

                                <retrospectivetemp name="Editing portfolio" :height="height" v-if="portfolio && temp" :portfolio="portfolio" :assets="temp"/>

                                <retrospectivetemp name="Optimized portfolio" :height="height" v-if="portfolio && optimizedPortfolio" :portfolio="portfolio" :assets="optimizedPortfolio.positions"/>

                                <!--<retrospective :portfolio="portfolio"/>-->
                            </template>
                        </div>
                    </div>
                </template>
            </widget>

            <!--<widget name="factoranalysis" :customscroll="false" :widgets="widgets">
                <template v-slot:content>
                    <template  v-if="portfolio">
                        <factoranalysis :portfolio="portfolio"/>
                    </template>
                </template>
            </widget>-->

        </div>

        <div class="navcontrols" v-if="portfolio">
            <div class="navcontrol" :key="i" v-for="(slide, i) in widgets.slides" :class="{active : slide.active}" @click="e => {toslide(slide)}">
                <i class="fas fa-circle"></i>
            </div>
        </div>

        <div class="portfoliotip" v-if="!portfolio">
            <div class="wrapper" v-if="!portfolioId || error">
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

        <v-tour name="summarytour" :steps="summarytoursteps" :callbacks="tourclbks" :options="{ highlight: true }"></v-tour>
    </template>

    <template v-else>
        <div class="unsupportmobile">
            <div class="wrapper">

                <span>
                    This report is not displayed in this screen resolution. Rotate the screen
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
