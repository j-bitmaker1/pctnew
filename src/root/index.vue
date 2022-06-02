<template>
<div id="root">

    <div class="cameramoduleWrapper" v-if="camera">
        <camera v-bind="camera.data || {}" v-on="camera.events" @close="closeCamera"/>
    </div>

    <div class="rootapp" v-show="!camera">

        <div class="layouts">
            <appmenu v-if="auth == 1" />

            <vue-page-transition name="fade-in-right">
                <router-view></router-view>
            </vue-page-transition>
        </div>

        <gallery v-if="gallery" :images="gallery.images" :index="gallery.index" @close="closeGallery" />

		<modals />
    </div>

    <fx v-if="fx"/>

    <transition name="fade" v-if="iconshow">
        <fixedmessageicon />
    </transition>

    <!-- and other modals -->

    <preloader v-if="globalpreloader" />

</div>
</template>

<script src="./index.js"></script>

<style lang="sass" src="./index.sass"></style>
