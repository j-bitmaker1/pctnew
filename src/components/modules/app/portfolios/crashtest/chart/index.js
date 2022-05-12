import { mapState } from 'vuex';
import f from '@/application/functions.js'
export default {
    name: 'portfolios_crashtest_chart',
    props: {
        ct : Object
    },

    data : function(){

        return {
            loading : false,
            intervals : 3
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        maxabs : function(){
            return Math.max(Math.abs(this.ct.profit), Math.abs(this.ct.loss))
        },
        roundbase : function(){
            return Math.pow(10, Math.max((this.maxabs.toFixed(0)).length - 3, 1))
        },

        currentStyles : state => state.currentStyles
    }),

    methods : {
        height : function(scenario){

            if(!this.maxabs) return 0

            return 100 * Math.abs(scenario.loss) / this.maxabs

        },

        color : function(scenario){

            return this.$store.getters.colorByValue(scenario.loss)

        },

        num : function(index){
            return f.round((index + 1) * (this.maxabs / this.intervals), this.roundbase)
        }
    },
}