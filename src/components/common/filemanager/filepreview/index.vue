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
            var type = this.file.ContentType

            if (type) {
                if (type == 'application/pdf') return "fas fa-file-pdf"
                if (type == 'text/csv') return "fas fa-file-csv"

                if (type.indexOf('xls') > -1 || type.indexOf('xlsx')) return "fas fa-file-excel"
            }

            return "fas fa-file"
        },

        type: function () {
            var type = this.file.ContentType

            if (type) {
                if (type == 'application/pdf') return "PDF"
                if (type == 'text/csv') return "CSV"
                if (type.indexOf('xls') > -1 || type.indexOf('xlsx')) return "XLS"
            }

            return "File"
        }
    }),

    methods: {

    },
}
</script>
