import { mapState } from 'vuex';
import f from "@/application/shared/functions.js";

export default {
    name: 'crashtest_crslider',
    props: {
        ct : Object,
        items : Array,
        th : Object
    },

    data : function(){

        return {
            loading : false,
            drag : null
        }

    },

    beforeDestroy(){
        console.log('beforeDestroy')
        this.rm()
       
    },

    created () {
        
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        rm : function(){
            this.drag = null

            window.removeEventListener('mousemove', this.mousemove)
            delete document.onmouseleave
        },
        mousemove : function(e){

            if(!this.drag) return

            var index = this.drag.item.index || this.drag.item.th
            var value = e.clientX - this.drag.x

            if(this.drag.borders[0] < value && this.drag.borders[1] > value){

                var valuepercent = Number((((value - this.drag.borders[0]) / (this.drag.borders[1] - this.drag.borders[0])) * 100).toFixed(0))

                console.log('valuepercent', valuepercent)

                this.$set(this.drag, 'value', valuepercent)

                if (this.$refs[index])
                    this.$refs[index][0].style.transform = 'translateX('+(value)+'px)'

            }
        },

        mousedown : function(e, item){

            return
            if(item.index != 'ocr') return

            var lx = 0
            var index = item.index || item.th
            var left = 0
            var borders = [0,0]


            if (this.$refs[index]){
                lx = Number((this.$refs[index][0].style.transform || '').replace('px)', '').replace('translateX(', ''))
                left = Number((this.$refs[index][0].style.left || '0%').replace('%', ''))
            }

            if (this.$refs.slider){
                var w = this.$refs.slider.clientWidth || 0

                console.log("W", w, left)

                borders = [-(w - (w * (100 - left) / 100)), w - w * left / 100]
            }

            console.log("B", borders)

            this.drag = {
                item,
                x : e.clientX - lx,
                borders,
                left
            }

            window.addEventListener('mousemove', this.mousemove)
            window.addEventListener('mouseup', this.mouseup)

            document.onmouseleave = () => {
                this.rm()
            }
        },

        mouseup : function(){

            if(this.drag){
                console.log({
                    item : this.drag.item,
                    value : this.drag.value
                })
            }
            this.rm()
        },

        valuetext : function(item){

            if(this.drag){
                var i = this.drag.item.index || this.drag.item.th
                var i2 = item.index || item.th

                if (i2 == i && this.drag.value){
                    return this.drag.value
                }
            }
  
            return this.core.pct.ocr(item.index ? this.ct[item.index] : this.th[item.th])
        },

        value : function(item){
            return this.core.pct.ocr(item.index ? this.ct[item.index] : this.th[item.th])
        },

        color : function(item){

            if(!item.index) return

            var value = this.valuetext(item)

            var ratingGradient = [
                {
                    color : [0,108,40,1],
                    position : 0
                },
                {
                    color :  [228,255,0,1],
                    position : 50
                },
                {
                    color : [255,0,69,1],
                    position : 100
                },
            ];
            /*---------------------------------------------------------------------------------------*/
            // Crash ratings
    
            return f.colorFromGradient({
                gradient : ratingGradient,
                value : value,
                toHex : true
            });
        }
    },
}