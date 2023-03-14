<template>
  <div class="logotype">
    <div class="item">
      <div class="logo">
        <img v-if="!small" src="@/assets/logo.svg"> 
        <img v-if="small" src="@/assets/logosmall.svg"> 
      </div>
    </div>
  
  </div>
</template>

<script src="./index.js"></script>
<style scoped lang="sass" src="./index.sass"></style>