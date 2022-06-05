<template>
<div id="notifications_actual">
    <transition name="list">
        <div class="showMore mobp" v-if="unfilteredCount > 0">
            <swipable :directions="directionsShowMore" @end="e => swipedShowMore(e)">
                <div class="showMoreWrapper" @click="showmore">
                    <span>Show more ({{unfilteredCount}})</span>
                </div>
            </swipable>
        </div>
    </transition>

    <div class="listContainer">

        <list transition="list" :items="filtered" @click="iteraction">
            <template v-slot:default="slotProps">

                <swipable @starttouch="starttouch" @clear="endtouch" @endtouch="endtouch" :directions="directions" @end="e => swiped(slotProps.item, e)">
                    <notification :event="slotProps.item" @iteraction="iteraction" @close="e => hide(slotProps.item, true)"/>
                </swipable>

            </template>
        </list>
    </div>

   

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
