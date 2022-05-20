import _ from 'underscore';
import { mapState } from 'vuex';
import VueSlider from 'vue-slider-component'
import summarybutton from '@/components/delements/summarybutton/index.vue'
export default {
    name: 'client_risk',
    props: {
        target : Number
    },

    components : {
        VueSlider, summarybutton
    },

    data : function(){

        return {
            loading : false
        }

    },

    created(){
        console.log(this.portfolio)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        portfolio : function(){
			return this.core.pct.riskscore.portfolio(this.target)
		},

        /*slidersWidthStyles : function(){
            return _.map(this.summary, (s) => {
                return {
                    "flex-basis" : 
                }
            })
        },*/

        summary : function(){

            return _.map(this.core.pct.riskscore.constants.scenarios, (scenario) => {

                var value = 0

                var pct = _.find(this.portfolio.pct.sc, (s) => {
                    return s.id == scenario.id
                }) 

                if (scenario.maxloss){
                    value = - this.core.pct.riskscore.portfolioLoss(this.portfolio)
                }
                else{
                    value = pct.loss
                }

                return {
                    index : scenario.id,
                    text : scenario.name,
                    value : value,
                    negative : scenario.negative
                }
            })


        },

        sliders : function(){

            return _.map(this.core.pct.riskscore.constants.scenarios, (scenario) => {

                var range = {
                    min : scenario.min,
                    max : scenario.max
                }

                var psrange = {
                    min : 0,
                    max : 0
                }

                var spacebase = 0
                var space = 0

                var pct = _.find(this.portfolio.pct.sc, (s) => {
                    return s.id == scenario.id
                })  

                if (scenario.maxloss){
                    pct = {
                        loss : this.core.pct.riskscore.portfolioLoss(this.portfolio)
                    }

                    range.max = -6.8

                    psrange.min = scenario.min
                }
                else{
                    range.min = pct.loss

                    var lossDifference = 40 - Math.abs(pct.loss)

                    range.max = range.min + (scenario.negative ? (-1) : 1) * lossDifference
                    psrange.max = range.max
                }

                space = 100 * Math.abs((scenario.negative ? range.max : range.min)) / Math.abs(psrange.max - psrange.min)

                range.max = Number(range.max.toFixed(1))
                range.min = Number(range.min.toFixed(1))

                return {
                    scenario : scenario,
                    pct,
                    space,
                    psrange,
                    mode : 'p',
                    options : {
                        interval : 0.1,
                        type : Number,
                        ...range
                    }
                }
            })

		},
    }),

    methods : {
        change : function(value, slider){

            if(!slider.scenario.maxloss)
                value = value + value * slider.pct.loss / this.core.pct.riskscore.constants.maxLoss

            var target = Number(this.core.pct.riskscore.lossToCr(Math.abs(value)))

            this.$emit('change', target)
        }
    },
}