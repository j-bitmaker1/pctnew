<template>
<div class="htmleditor">
    <trumbowyg ref="editor" @tbw-init="init" v-model="body" :config="config" class="form-control" name="content"></trumbowyg>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
