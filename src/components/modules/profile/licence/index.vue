<template>
<div id="licence">
    <list :items="features">

        <template v-slot:default="slotProps">

            <div class="feature mobp" :class="{need : needMap[slotProps.item.id]}">

                <div class="header">
                    
                    <div class="name">
                        <span>{{$t(slotProps.item.name)}}</span>
                    </div>

                    <div class="my" :class="{expired : !myfeatures[slotProps.item.id].valid, valid : myfeatures[slotProps.item.id].valid}" v-if="myfeatures[slotProps.item.id]">
                        <div class="expiration">
                            Active to: <date :date="myfeatures[slotProps.item.id].to" :relative="false"/>
                        </div>
                    </div>

                    <div class="my" v-if="slotProps.item.trial && !myfeatures[slotProps.item.id]">
                        <button class="button small orange gettrial" @click="e => gettrials(slotProps.item)">Get trial</button>
                    </div>
                    
                </div>

                <div class="description">
                    <span>{{$t(slotProps.item.description)}}</span>
                </div>

                <div class="needFeature" v-if="needMap[slotProps.item.id]">
                    <span>This licence need to be to use previous page</span>
                </div>
            </div>

        </template>

    </list>

    

    <div class="contacttosupport">

        <div class="caption">
            <span>Contact Support for License Issues</span>
        </div>
        <div class="buttons">
            <router-link to="/support">
                <button class="button black">Contact support</button>
            </router-link>
        </div>

        <sticker src="24-hours-support.png"/>

    </div>


    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
