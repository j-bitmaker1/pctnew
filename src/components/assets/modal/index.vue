<template>
<transition name="fade">
    <div id="modal" :class="(mclass || '') + ' ' + (data.notification ? 'hasnotification_tttt' : '') + ' ' + (pip ? 'pip' : '')">
        <div class="modal-backdrop" @click="close">
            <div class="closecsscross"></div>
        </div>

        <!--<div class="notificationWrapper" v-if="data.notification">
            <notification :event="data.notification" :withoutInternal="true" />
        </div>-->

        <div class="modal-wrapper">
            <swipable :directions="directions" @end="endswipe">

                <template v-slot:default>

                    <div :class="'modal ' + (mclass == 'absoluteContent' ? '' : 'customscroll')" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription" v-scroll="scrolling">

                        <div class="modal-header">
                            <div class="headerWrapper">
                                <slot name="header">
                                </slot>
                            </div>

                            <div class="modal-pip" v-if="canpip" @click="e => {changepip(!pip)}">
                                <i class="fas fa-compress"></i>
                            </div>

                            <div class="modal-close" @click="close">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>

                        <div class="modal-body" id="modalDescription">
                            <slot v-if="!module && !path" name="body" :scroll="scroll">
                            </slot>
                            <component @changeData="changeData" @blockclose="setblockclose" v-if="module" :is="module" @close="close" :wnd="true" v-bind="data || {}" v-on="events" :scroll="scroll" />
                            <!--<component v-if="path" :is="bypath()" @close="close" :wnd="true" v-bind="data || {}" v-on="events" :scroll="scroll" />-->
                        </div>

                        <div class="modal-footer" v-if="displayFooter">

                        </div>

                    </div>
                </template>
            </swipable>
        </div>

    </div>

</transition>
</template>

<script src="./index.js"></script>

<style  lang="sass" src="./index.sass"></style>
