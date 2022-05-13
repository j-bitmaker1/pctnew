<template>
  <span class="coloredNumber" :style="'color:' + color">
    <value :value="number" v-if="number"/>
    <span v-else>&mdash;</span>
  </span>
</template>

<script src="./index.js"></script>
<style scoped lang="sass" src="./index.sass"></style>