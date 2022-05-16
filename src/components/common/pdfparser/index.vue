<template>
<div id="pdfparser" class="absmodal">
 

    <iframe :src="src" width="100%" height="100%" @load="onLoad"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
