<template>
<div class="wrapper">
    <v-photoswipe v-if="images && images.length" :isOpen="isOpen" :items="images" :options="options" @close="close" @sharecordova="sharecordova"></v-photoswipe>
</div>
</template>
<style scoped lang="sass">
.wrapper
	position: fixed
	z-index: 50000
	left : 0
	top : 0
	bottom : 0
	right : 0
</style>
<script>
import {
    PhotoSwipe,
    PhotoSwipeGallery
} from 'v-photoswipe'
export default {
    props: {
        images: Array,
        index: Number
    },

    components: {
        'v-photoswipe': PhotoSwipe,
        'v-photoswipe-gallery': PhotoSwipeGallery
    },

    data: () => {

        return {
            isOpen: false
        }

    },

    mounted() {
        this.init()
    },

    computed: {

        options: function () {

            var o = {
                index: 0,
                arrowEl: true,
                fullscreenEl: false,
                shareEl: false,
                history: false
            }

            return o
        }

    },

    methods: {

        close() {
            this.isOpen = false
            this.$emit('close')
        },

        init() {

            this.isOpen = true
            this.$set(this.options, 'index', this.index)
        },

        sharecordova: function (src) {
            if (window.plugins && window.plugins.socialsharing) {
                window.plugins.socialsharing.shareWithOptions({
                    files: [src]
                });
            }
        },

    }
}
</script>
