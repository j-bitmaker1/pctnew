<template>
    <img v-images-loaded="imageloaded" :class="{loaded}" :width="width" :src="require('@/assets/' + this.src)" />
</template>


<style scoped lang="sass">

img
    opacity: 0
    +transition(0.1s)

    &.loaded
        opacity: 1

</style>

<script>
    import imagesLoaded from 'vue-images-loaded'
    export default {
        name: 'sticker',
        directives: {
            imagesLoaded
        },
        props: {
            src : String,
            width : Number
        },

        data : function(){
            return {
                loaded : false
            }
        },

        methods : {
            imageloaded : function(){
                this.loaded = true
            }
        }
    }

</script>

