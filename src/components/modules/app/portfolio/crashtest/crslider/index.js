import { mapState } from 'vuex';
import f from "@/application/shared/functions.js";

export default {
    name: 'crashtest_crslider',
    props: {
        cts : Object,
        cpmdata : Array,
        portfolios : Object,
        optimize : Number,
        doingoptimization : Object
    },

    data : function(){

        return {
            loading : false,
            drag : null
        }

    },

    beforeDestroy(){
        this.rm()
       
    },

    created () {
        
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        markers(){
            var result = _.filter(_.map(this.portfolios, (portfolio, i) => {

                if(!this.cts.cts || !this.cts.cts[i]) return null

                return {
                    index : i,
                    value : this.cts.cts[i].ocr,
                    text : "Crash rating: " + portfolio.name,
                    temp : portfolio.tempportfolio || false,
                    canoptimize : this.optimize == i//this.optimize ? true : false
                }
                
            }), (p) => {return p})

            return result.concat(this.cpmdata || [])
        }
    }),

    methods : {
        rm : function(){

            if(this.drag){

                var index = this.drag.item.index

                if (this.$refs[index])
                    this.$refs[index][0].style.transform = ''
            }

            this.drag = null

            window.removeEventListener('mousemove', this.mousemove)
            window.removeEventListener('mouseup', this.mouseup)
            delete document.onmouseleave


            window.removeEventListener('touchmove', this.mousemove)
            window.removeEventListener('touchend', this.mouseup)
        },

        clientX : function(e){

            if(e.changedTouches){
                return e.changedTouches[0].clientX
            }

            return e.clientX 
        },

        mousemove : function(e){

            if(!this.drag) return

            var index = this.drag.item.index
            var value = this.clientX(e) - this.drag.x

            if(this.drag.borders[0] < value && this.drag.borders[1] > value){

                var valuepercent = Number((((value - this.drag.borders[0]) / (this.drag.borders[1] - this.drag.borders[0])) * 100).toFixed(0))

                this.$set(this.drag, 'value', valuepercent)

                if (this.$refs[index])
                    this.$refs[index][0].style.transform = 'translateX('+(value)+'px)'

            }
        },

        mousedown : function(e, item){

            if(!item.canoptimize) return

            var lx = 0
            var index = item.index
            var left = 0
            var borders = [0,0]


            if (this.$refs[index]){
                lx = Number((this.$refs[index][0].style.transform || '').replace('px)', '').replace('translateX(', ''))
                left = Number((this.$refs[index][0].style.left || '0%').replace('%', ''))
            }

            if (this.$refs.slider){
                var w = this.$refs.slider.clientWidth || 0

                borders = [-(w - (w * (100 - left) / 100)), w - w * left / 100]
            }

            this.drag = {
                item,
                x : this.clientX(e) - lx,
                borders,
                left
            }

            console.log('this.drag', this.drag, e)

            window.addEventListener('mousemove', this.mousemove)
            window.addEventListener('mouseup', this.mouseup)

            window.addEventListener('touchmove', this.mousemove)
            window.addEventListener('touchend', this.mouseup)

            document.onmouseleave = () => {
                this.rm()
            }
        },

        mouseup : function(){

            if (this.drag){

                if(this.drag.value){
                    if (this.drag.item.value == this.drag.value){
                        this.$emit('optimization', null)
                    }
                    else{

                        this.$emit('optimization', {
                            portfolio : this.portfolios[this.drag.item.index],
                            ocr : this.drag.value
                        })
                    }
                }

            }

            this.rm()
        },

        valuetext : function(item){

            if(this.drag){
                var i = this.drag.item.index
                var i2 = item.index

                if (i2 == i && this.drag.value){
                    return this.core.pct.ocr(this.drag.value)
                }
            }

            if(this.doingoptimization && this.doingoptimization.ocr){

                if(item.index == this.doingoptimization.portfolio.id){
                    return this.core.pct.ocr(this.doingoptimization.ocr)
                }
            }
  
            return this.core.pct.ocr(item.value)
        },

        value : function(item){

            if(this.doingoptimization && this.doingoptimization.ocr){

                if(item.index == this.doingoptimization.portfolio.id){
                    return this.core.pct.ocr(this.doingoptimization.ocr)
                }

            }

            return this.core.pct.ocr(item.value)
        },

        color : function(item){

            if(!item.index) return

            var value = this.valuetext(item)

            var alpha = item.temp ? 0.5 : 1

            var ratingGradient = [
                {
                    color : [0, 108, 40, alpha],
                    position : 0
                },
                {
                    color :  [228, 255, 0, alpha],
                    position : 50
                },
                {
                    color : [255, 0, 69, alpha],
                    position : 100
                },
            ];
            /*---------------------------------------------------------------------------------------*/
            // Crash ratings

         
            return f.colorFromGradient({
                gradient : ratingGradient,
                value : value,
            });
        }
    },
}