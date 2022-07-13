<template>
<div id="campaigns_start">

    <template v-if="!loading">

        <div class="campaignTemplate mobp">
            <div class="caption">
                <div class="num"><span>1</span></div> <div class="sz"><span>Select campaign template</span></div>
            </div>

            <div class="selected" v-if="template">
                <preview :template="template"  :showMenu="false"/>

                <div class="checkTemplate">
                    <linepreloader v-if="templatechecking"/>
                    <template v-else>
                        <div class="tinfo valid" v-if="templatechecked">
                            <i class="fas fa-check-circle"></i> <span>Template checked</span>
                            </div>
                        <div class="tinfo invalid" v-else>
                            <i class="fas fa-times-circle"></i> <span>Template is not valid</span> <span class="toedit" @click="edittemplate">Edit</span>
                        </div>
                    </template>
                </div>
            </div>

            <div class="buttonWrapper">
                <button class="button" :class="{black : template}" @click="selecttemplate">Select</button>
            </div>
        </div>


        <div class="contacts mobp" v-if="template">
            <div class="caption">
                <div class="num"><span>2</span></div> <div class="sz"><span>Select recipients</span></div> <div class="sz cr" v-if="contactsSelected"><span >({{contactsSelected}})</span></div>
            </div>

            <div class="selected" v-if="contactsSelected">
                <div class="clients">

                    <listgroupedsliced :group="contactsGrouped" :count="4" ref="list">

                        <template v-slot:group="slotProps">
                            <div class="groupCaption ">
                                <span>{{$t('campaigns.clientsGroup.' + slotProps.index)}}</span>
                            </div>
                        </template>

                        <template v-slot:list="slotProps">
                            <div class="lineClientPreviewWrapper">
                                <lineClientPreview :profile="slotProps.item"/>
                            </div>
                            
                        </template>
                    </listgroupedsliced>

                
                </div>
            </div>

        <div class="buttonWrapper">
                <button class="button" :class="{black : contactsSelected}" @click="selectcontacts">Select</button>
            </div>
        </div>

        <div class="settings mobp" v-if="template && contactsSelected">
            <div class="caption">
                <div class="num"><span>3</span></div> <div class="sz"><span>Settings</span></div>
            </div>

            <div class="settingsContent">
                <forms @change="schange" :value="settings" :fields="settingsFields"/>
            </div>

        </div>

        <div class="stickerWrapper mobp">
            <sticker :src="sticker" /> 
        </div>


        <div class="savePanel">
            <button class="button black" @click="cancel">
                Cancel
            </button>

            <button class="button" @click="start">
                Start
            </button>
        </div>

    </template>

    <linepreloader v-else/>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
