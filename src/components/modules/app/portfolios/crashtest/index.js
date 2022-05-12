import { mapState } from 'vuex';

import chart from './chart/index.vue'
import ctdetails from './details/index.vue'

export default {
    name: 'portfolios_crashtest',
    props: {
    },

    components : {
        chart, 
        ctdetails
    },

    data : function(){

        return {
            loading : false,

            ct : {},

            valuemodes : [
                {
                    icon : "fas fa-dollar-sign",
                    id : 'd'
                },
                {
                    icon : "fas fa-percent",
                    id : 'p'
                }
            ],

            summary : [

                {
                    text : 'labels.crashrating',
                    index : 'ocr'
                },
                {
                    text : 'labels.tolerance',
                    index : 'pcr'
                }
                
            ]

        }

    },

    created : function(){
        this.get()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        valuemode: state => state.valuemode,
    }),

    methods : {
        get : function(){

            this.loading = true

            this.core.pct.get().then(r => {

                this.ct = r

                console.log('this.ct', this.ct)

                return Promise.resolve(r)
            }).finally(() => {
                this.loading = false
            })
        },

        changevaluemode : function(v){
            this.$store.commit('valuemode', v)
        }
    },
}