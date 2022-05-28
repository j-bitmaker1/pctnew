<template>
<div class="filemanager_list_file">

    <div class="filepreviewWrapper">
        <filepreview :file="file"/>
    </div>

    <div class="name">
        <span v-if="file.info.FileName">{{file.info.FileName}}</span>
        <span v-else>&mdash;</span>
    </div>

    <div class="size">
        <span v-if="size">{{size}}</span>
        <span v-else>&mdash;</span>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
