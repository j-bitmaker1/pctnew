import { _ } from 'core-js';
import { mapState } from 'vuex';
import factor from '../factor/index.vue'

import colors from "@/application/shared/utils/colors.js";


export default {
    name: 'factoranalysis_map',
    props: {
        factors : Array,
        portfolio : Object
    },

    components : {
        factor
    },

    data : function(){

        return {
            loading : false,
            size : 5,
            values : [null, null],
            result : null,
            zoomed : null
        }

    },

    created : () => {

    },

    watch: {

        ['portfolio.positions'] : {
            deep : true,
            handler : function(){
                this.get()
            }
        },

        factors : {
            deep : true,
            handler : function(){
                this.get()
            }
        },

        values: {
            deep : true,
            handler : function(){
                this.get()
            }
        },
    },
    computed: mapState({
        auth : state => state.auth,

        xfactor : function(){
            return this.factors[0] ? this.factors[0] : null
        },

        yfactor : function(){
            return this.factors[1] ? this.factors[1] : null
        },

        gradient : function(){

            if(!this.result) return null

            var g = [
                {
                    color: [...this.$store.getters.currentColorValue('--color-bad'), 1],
                    position: this.result.min,
                },
                {
                    color: [...this.$store.getters.currentColorValue('--color-yellow'), 1],
                    position: (this.result.max + this.result.min) / 2,
                },
                {
                    color: [...this.$store.getters.currentColorValue('--color-good'), 1],
                    position: this.result.max,
                }
            ]

            return g

        },

        defaultColor : function(){
            return this.$store.getters.currentColorValue('--neutral-grad-0')
        }
    }),

    methods : {
        color : function(value){


            if(!this.gradient) return this.defaultColor

            var color = colors.colorFromGradient({
                gradient: this.gradient,
                value: value,
                toHex : true
            });


            return color

        },
        colorByIndex : function(index){

            if(!this.result) return this.defaultColor

            return this.color(this.result.scenarioResults[index].value)
        },
        changeFactor : function(i){
            this.$emit('changeFactor', i)

            this.$set(this.values, i, null)
        },

        change : function(i, v){

            var bf = this.values[i] || {}
                bf[v.index] = v.value

            this.$set(this.values, i, bf)
        },

        load : function(data){
            var scenarios = []

            var step1 = (data[0].max - data[0].min) / this.size
            var step2 = (data[1].max - data[1].min) / this.size

            for(var i = 0;  i < this.size; i++){
                for(var j = 0; j < this.size; j++){
                    
                    var scenario = {
                        factors : [
                            {
                                name : data[0].factor.name,
                                value : (i * step1 + data[0].min).toFixed(2)
                            },

                            {
                                name : data[1].factor.name,
                                value : (i * step2 + data[1].min).toFixed(2)
                            }
                        ]
                    }

                    scenarios.push(scenario)
                }
            }


            return this.core.api.pctapi.stress.customtestScenarios({
                portfolio : this.portfolio,
                scenarios
            }).then(r => {

                r.max = _.max(r.scenarioResults, (s) => {
                    return s.value
                }).value

                r.min = _.min(r.scenarioResults, (s) => {
                    return s.value
                }).value

                return Promise.resolve(r)
            })
            
        },

        get : function(){
            if(this.xfactor && this.yfactor){
                var data = [
                    {
                        min : this.values[0] && typeof this.values[0].min != 'undefined' ? this.values[0].min : this.xfactor.min,
                        max : this.values[0] && typeof this.values[0].max != 'undefined' ? this.values[0].max : this.xfactor.max,
                        factor : this.xfactor
                    },

                    {
                        min : this.values[1] && typeof this.values[1].min != 'undefined' ? this.values[1].min : this.yfactor.min,
                        max : this.values[1] && typeof this.values[1].max != 'undefined' ? this.values[1].max : this.yfactor.max,
                        factor : this.yfactor
                    } 
                ]

                this.loading = true

                this.load(data).then((result) => {

                    this.result = result

                }, {
                    showStatusFailed : true
                }).finally(() => {
                    this.loading = false
                })
            }
            else{
                this.result = null
            }
        },

        zoom : function(index){
            this.zoomed = index

            setTimeout(() => {
                if(this.zoomed == index) this.zoomed = null
            }, 2000)
        }
    },
}