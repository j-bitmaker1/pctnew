<template functional>
  <div class="userpic">

    <div class="userpicSquareWrapper">

      <div class="userpicSquareInnerWrapper" >
        <div class="userpicSquareInnerWrapper" :class="props.status">

          <bgimage v-if="props.userinfo.image" :src="props.userinfo.image"/>

          <div v-if="!props.userinfo.image && props.userinfo.FName && props.userinfo.LName" class="charAvatar">
            <span>{{props.userinfo.FName.charAt(0)}}{{props.userinfo.LName.charAt(0)}}</span>
          </div>

          <div class="statusIcon">  
            <i v-if="props.status == 'blocked' || props.status == 'ban'" class="fas fa-ban"></i>
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



































