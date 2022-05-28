<template>
<div id="filemanager_filepreview">
    <div class="icon">
        <i :class="icon" />
    </div>
</div>
</template>

<style scoped lang="sass">
.icon
    width: 30px
    height: 44px
    line-height: 44px
    text-align: center
    color : srgb(--neutral-grad-2)
</style>

<script>

import {
    mapState
} from 'vuex';

import f from '@/application/functions';

export default {
    name: 'filemanager_filepreview',
    props: {
        file: Object
    },
    computed: mapState({
        auth: state => state.auth,

        icon: function () {
            var type = f.deep(this.file, 'info.ContentType')

            if (type) {
                if (type == 'application/pdf') return "fas fa-file-pdf"
            }

            return "fas fa-file"

        }
    }),

    methods: {

    },
}
</script>
