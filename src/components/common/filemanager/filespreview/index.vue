<template>
<div class="filemanager_filespreview">
    <filePreview v-for="file in info" :key="file.name" :file="file"/>
</div>
</template>

<script>

import {
    mapState
} from 'vuex';

import filePreview from '../filepreview/index.vue'

export default {
    name: 'filemanager_filespreview',
    props: {
        info: Array
    },

    components : {
        filePreview
    },

    methods: {

    },
}
</script>
