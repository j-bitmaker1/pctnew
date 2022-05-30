<template>
  <div class="userpic">

    <div class="userpicSquareWrapper">

      <div class="userpicSquareInnerWrapper" >
        <div class="userpicSquareInnerWrapper" :class="status">

          <bgimage v-if="image" :src="image"/>

          <div v-if="!image && (userinfo.FName || userinfo.LName)" class="charAvatar">
            <span v-if="userinfo.FName">{{userinfo.FName.charAt(0)}}</span><span v-if="userinfo.LName">{{userinfo.LName.charAt(0)}}</span>
          </div>

          <div class="statusIcon">  
            <i v-if="status == 'blocked' || status == 'ban'" class="fas fa-ban"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script src="./index.js"></script>
<style scoped lang="sass" src="./index.sass"></style>

<!-- THEMES BEGIN -->
<!-- THEMES END -->



































