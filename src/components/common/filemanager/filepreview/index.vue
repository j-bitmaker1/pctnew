<template>
<div id="filemanager_filepreview">
    <div class="icon">
        <span>{{type}}</span>
    </div>
</div>
</template>

<style scoped lang="sass">
.icon
    width: 44px
    height: 44px
    line-height: 42px
    text-align: center
    border-radius: 12px
    border : 1px solid srgb(--neutral-grad-1)
    color : srgb(--neutral-grad-2)

    span
        font-size: 0.9em
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
        },

        type: function () {
            var type = f.deep(this.file, 'info.ContentType')

            if (type) {
                if (type == 'application/pdf') return "PDF"
            }

            return ""
        }
    }),

    methods: {

    },
}
</script>
