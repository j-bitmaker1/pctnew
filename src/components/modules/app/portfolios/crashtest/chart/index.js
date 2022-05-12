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
        }
    }),

    methods : {
        height : function(scenario){

            if(!this.maxabs) return 0

            return 100 * Math.abs(scenario.loss) / this.maxabs

        },

        color : function(scenario){
            if(scenario.loss > 0) return 'rgb(7, 108, 52)'

            if(scenario.loss < 0) return 'rgb(244, 26, 77)'
        },

        num : function(index){

            console.log('roundbase', this.roundbase)

            return f.round((index + 1) * (this.maxabs / this.intervals), this.roundbase)
            
        }
    },
}