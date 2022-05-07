<template>
  <div id="root">

    <appmenu v-if="auth == 1"/>
    <vue-page-transition name="fade-in-right">
      <router-view></router-view>
    </vue-page-transition>

    <gallery
      v-if="gallery"
      :images="gallery.images"
      :index="gallery.index"
      @close="closeGallery"
    />

    <!-- and other modals -->

    <preloader v-if="globalpreloader" />
	
  </div>
</template>

<script src="./index.js"></script>
<style lang="sass" src="./index.sass"></style>