<template>
<div id="scenarios_custom">

    <div class="info" v-if="mode == 'customscenario' || tosavemode">

        <div class="header">
            <div class="caption">
                <span>Information</span>
            </div>
        </div>

        <div class="form ">
            <forms :value="{name, description}" @change="changeInfo" ref="form" :fields="fields"/>
        </div>

    </div>
    
    <div class="factors">

        <div class="header">
            <div class="caption">
                <span>Factors</span>
            </div>
        </div>

        <div class="empty" v-if="!hasfactors">
            <span>Add factors to you custom scenario</span>
        </div>

        <list :items="factors" v-else>
            <template v-slot:default="slotProps">

                <div class="factorWrapper">
                    <factor :factor="slotProps.item" @changed="v => {changed(slotProps.item, v)}" />
                </div>

            </template>
        </list>

        <div class="panel">
            <button class="button small" @click="addfactor">
                Select factors
            </button>
        </div>

        <div class="losswrapper " v-if="dct && canload">
            <div v-if="!dctloading" class="txt">
                <span>Scenatio Loss:</span> <value :value="dct.loss" mode="auto" colored="true" />
            </div>

            <linepreloader v-else/>
        </div>

    </div>

    <div class="portfolioPart ">
        <div class="header mobp">
            <div class="caption">
                <span>Portfolio</span>
            </div>
            <div class="panel">
                <button class="button black" @click="selectPortfolio">Select portfolio</button>
            </div>
        </div>

        <div class="portfolio" v-if="portfolio">
            <div class="preview mobp">
                <portfolioPreview :portfolio="portfolio" :hasmenu="false" />
            </div>

            <div class="contributors" v-if="dct && canload">

                <div class="preloaderWrapper" v-if="dctloading">
                    <linepreloader />
                </div>

                <div>

                    <div class="header mobp">
                        <div class="caption">
                            <span>Contributors</span>
                        </div>
                        <div class="lossicons">
                            <div class="positive" v-if="positives"><i class="fas fa-arrow-up"></i>
                                <value :value="positives" />
                            </div>
                            <div class="negative" v-if="negatives"><i class="fas fa-arrow-down"></i>
                                <value :value="negatives" />
                            </div>
                        </div>
                    </div>

                    <div class="contributorsList">
                        <list :items="contributors">
                            <template v-slot:default="slotProps">

                                <div class="contributorWrapper mobp">
                                    <contributor :contributor="slotProps.item" :maxabs="maxabs" />
                                </div>

                            </template>
                        </list>
                    </div>

                </div>

                

            </div>

            <div class="empty" v-else>
                <span>Please add stress factors to calculate loss</span>
            </div>

        </div>

        <div class="empty" v-else>
            <span>Select portfolio for test your custom scenario</span>
        </div>
    </div>

    <div class="savePanel" v-if="mode == 'customscenario' || tosavemode">
        <button class="button black" @click="cancel">
            Cancel
        </button>

        <button class="button" @click="save" :disabled="!canloadStrong">
            Save
        </button>
    </div>

    <div v-if="mode != 'customscenario' && canloadStrong && portfolio && !tosavemode" class="savePanel">
        <button class="button" @click="changemodetosave">
            Add to scenario manager
        </button>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
