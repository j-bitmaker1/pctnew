<template>
<div id="campaigns_templates">

    <linepreloader v-if="loading"/>

    <div class="cnt" v-if="!loading && templates">
    </div>

    <div class="empty">
        <span></span>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
