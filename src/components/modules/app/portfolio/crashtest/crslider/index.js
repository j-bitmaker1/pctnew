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
            loading : false
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        value : function(item){
            console.log('this.th', this.th)
            return this.core.pct.ocr(item.index ? this.ct[item.index] : this.th[item.th])
        },

        color : function(item){

            if(!item.index) return

            var value = this.value(item)

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