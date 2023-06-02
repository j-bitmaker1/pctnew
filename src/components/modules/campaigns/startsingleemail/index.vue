<template>
<div id="campaigns_start_single_email">

    <template v-if="!loading">

        <div class="contacts mobp" ref="recipients">
            <div class="caption">
                <div class="num"><span>1</span></div> <div class="sz"><span>Select recipient</span></div>
            </div>

            <div class="selected" v-if="contactSelected">
                <div class="clients">
                    <lineClientPreview :profile="contact"/>
                </div>
            </div>

            <div class="buttonWrapper">
                <button class="button" :class="{black : contactSelected}" @click="selectcontacts">Select</button>
            </div>
        </div>

        <div class="campaignTemplate mobp" v-if="contactSelected" ref="template">
            <div class="caption">
                <div class="num"><span>2</span></div> <div class="sz"><span>Email</span></div>
            </div>

            <div class="templateCaption">
                <input ref="subject" type="text" v-model="m_caption" @keyup="keyupSubject" placeholder="Email subject"/>
            </div>

            <div class="templateBody">
                <htmleditor ref="htmleditor" @keyup="keyupEditor" v-model="m_body"/>
            </div>
        </div>

        <div class="settings mobp" v-if="contactSelected" ref="settings">
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
                Send
            </button>
        </div>

    </template>

    <linepreloader v-else/>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
