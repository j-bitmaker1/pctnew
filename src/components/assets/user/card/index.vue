<template>
  <div class="usercard">
    <div class="userpicWrapper">
      <userpic :userinfo="userinfo"/>
    </div>

    <div class="data" v-if="userinfo">
      <div class="login"><span>@{{userinfo.Login}}</span></div>
      <div class="name"><span>{{userinfo.FName}} {{userinfo.LName}}</span><span v-if="userinfo.Company && userinfo.Company.Name">, {{userinfo.Company.Name.replace('_' + userinfo.Login || '', '')}}</span></div>
    </div>

    <div class="dummy" v-else>
        <div class="block line">
        </div>

        <div class="block line medium">
        </div>
    </div>
  </div>
</template>

<script src="./index.js"></script>
<style scoped lang="sass" src="./index.sass"></style>