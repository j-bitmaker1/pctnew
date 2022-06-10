<template>
<div id="settings">
    <listgroupedsliced :group="settings" :count="3">

        <template v-slot:group="slotProps">
            <div class="groupCaption mobp">
                <span>{{$t('settings.' + slotProps.index)}}</span>
            </div>
        </template>

        <template v-slot:list="slotProps">
            <div class="setting mobp">

                <component v-if="slotProps.item.component" :is="slotProps.item.component"></component>

                <div class="view_button" v-if="slotProps.item.view == 'button'" @click="e => action(slotProps.item)"> 
                    <div class="label">
                        <span>{{$t(slotProps.item.text)}}</span>
                    </div>
                    <div class="button">
                        <i class="fas fa-caret-right"></i>
                    </div>
                </div>

                
            </div>
        </template>

    </listgroupedsliced>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
