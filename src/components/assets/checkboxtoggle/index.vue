<template>
<div class="checkboxtoggle">
    <iconstoggle :icons="icons" @change="v => {value = v}" :value="value"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
