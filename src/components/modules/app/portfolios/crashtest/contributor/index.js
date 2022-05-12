import { mapState } from 'vuex';

export default {
    name: 'portfolios_crashtest_contributor',
    props: {
        contributor : Object,
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

            return 100 * Math.abs(this.contributor.value) / this.maxabs

        },

        color : function(){
            return this.$store.getters.colorByValue(this.contributor.value)
        }
    }),

    methods : {
        
    },
}