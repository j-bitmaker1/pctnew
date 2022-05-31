<template>
  <div class="bgimage" :class="{loaded}" :style="'background-image:url('+imageSrc+'); background-size: cover; background-position: center center; background-repeat: no-repeat'">
    
  </div>
</template>


<style scoped lang="sass">

    .bgimage
        width : 100%
        height: 100%
        opacity: 0
        +transition(0.3s)

        &.loaded
            opacity: 1

</style>

<script>



    export default {
        name: 'bgimage',
        directives: {
        },
        props: {
            src : String
        },

        watch : {
            src : {
                immediate : true,
                handler : function(){
                    this.load()
                }
            }
        },

        data : function(){
            return {
                loaded : false,
                imageSrc : ''
            }
        },

        methods: {
            load : function(){
                if(this.src){
                    var image = new Image()
                    image.src = this.src

                    image.onload = () => {
                        this.imageSrc = this.src
                        this.loaded = true
                    }
                }   
            }
          
        }
    }

</script>

