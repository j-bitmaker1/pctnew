<template>
<div id="settings_scoreConverter">
    <linepreloader v-if="loading"/>
    <div class="cnt" v-else>

        <div class="useWrapper mobp">
            <div class="wr2">
                <iconstoggle :icons="useSchemaIcons" :value="useSchema" @change="changeUse"/>
                <div class="label">
                    <span>Use this risk score schema</span>
                </div>
            </div>
        </div>

        <div class="schemaWrapper">
            <div class="portfolio mobp" :key="portfolio" v-for="portfolio in portfolios">

                <div class="data">
                    <div class="name"><span>{{portfolio}}</span></div>

                    <div class="rxscore">
                        <span>Rixtrema score:</span> <span class="value">{{scores[portfolio]}}</span>
                    </div>
                </div>

                <div class="forvalue">
                    <input @change="e => setValue(e.target.value, portfolio)" :placeholder="scores[portfolio]" type="text" :value="userDefinedValues[portfolio] || ''"/>
                </div>
            </div>
        </div>

        <div class="savePanel">
            <button class="button black" @click="cancel">
                Cancel
            </button>

            <button class="button" @click="apply" :disabled="!haschanges">
                Save
            </button>
            
        </div>
    </div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
