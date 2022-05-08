<template>
  <div id="appmenu">

    <div class="logowrapper">
      <logotype />
    </div>

    <div class="items">

      <router-link :to="item.route" v-for="item in items"  :key="item.id">

      <div class="item"  :class="{active : item.id == active}" >
        <i :class="item.icon" /> <span>{{ $t(item.text) }}</span> 
        <div class="notifications" v-if="notifications(item.id)">{{notifications(item.id)}}</div>
      </div>

      </router-link>
    </div>

    

    <div class="footer">

      <div class="themeToggleWrapper">
        <themeToggle />
      </div>

      <div class="help">
        <i class="far fa-question-circle"></i> <span>{{$t('caption.helpfooter')}}</span>
      </div>
    </div>

  </div>
</template>

<script src="./index.js"></script>
<style scoped lang="sass" src="./index.sass"></style>