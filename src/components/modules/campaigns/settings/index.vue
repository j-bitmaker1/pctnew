<template>
<div id="campaigns_settings">

    <div class="caption mobp">
        <span>Marketing campaign settings</span>
    </div>

    <div class="setting mobp" v-for="setting in settings">

        <component v-if="setting.component" :is="setting.component"></component>

        <div class="view_button" v-if="setting.view == 'button'" @click="e => action(setting)"> 
            <div class="label">
                <span>{{$t(setting.text)}}</span>
            </div>
            <div class="button">
                <i class="fas fa-caret-right"></i>
            </div>
        </div>

        
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
