import { mapState } from 'vuex';

export default {
    name: 'portfolios_crashtest_scenario',
    props: {
        scenario : Object,
        ct : Object,
        maxabs : Number
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
        currentStyles : state => state.currentStyles,
        width : function(){

            if(!this.maxabs) return 0

            return 100 * Math.abs(this.scenario.loss) / this.maxabs

        },

        color : function(scenario){

            var st = '--neutral-grad-0'

            if(this.scenario.loss > 0) st = '--color-bad' 

            if(this.scenario.loss < 0) st = '--color-good' 

            return 'rgb(' + this.currentStyles.getPropertyValue(st) + ')'
        },
    }),

    methods : {
        
    },
}